"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { getUserProfile, updateUserProfile } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"
import { User, Save, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    // Estados para los formularios
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        shippingAddress: "",
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Estados para errores y carga
    const [profileErrors, setProfileErrors] = useState({})
    const [passwordErrors, setPasswordErrors] = useState({})
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [activeTab, setActiveTab] = useState("profile") // 'profile' o 'password'

    // Cargar datos del perfil
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login?redirect=perfil")
            return
        }

        const fetchProfileData = async () => {
            setIsLoadingProfile(true)
            try {
                const data = await getUserProfile()
                // Formatear la fecha para el input date
                let formattedDate = ""
                if (data.birthDate) {
                    formattedDate = new Date(data.birthDate).toISOString().split("T")[0]
                }

                setProfileData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    birthDate: formattedDate,
                    shippingAddress: data.shippingAddress || "",
                })
            } catch (error) {
                console.error("Error al cargar datos del perfil:", error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudieron cargar los datos del perfil. Por favor, intenta de nuevo.",
                })
            } finally {
                setIsLoadingProfile(false)
            }
        }

        fetchProfileData()
    }, [isAuthenticated, router, toast])

    // Manejar cambios en el formulario de perfil
    const handleProfileChange = (e) => {
        const { name, value } = e.target
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Limpiar errores al cambiar el valor
        if (profileErrors[name]) {
            setProfileErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    // Manejar cambios en el formulario de contraseña
    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Limpiar errores al cambiar el valor
        if (passwordErrors[name]) {
            setPasswordErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    // Validar formulario de perfil
    const validateProfileForm = () => {
        const errors = {}

        if (!profileData.firstName.trim()) {
            errors.firstName = "El nombre es obligatorio"
        }

        if (!profileData.lastName.trim()) {
            errors.lastName = "El apellido es obligatorio"
        }

        if (!profileData.birthDate) {
            errors.birthDate = "La fecha de nacimiento es obligatoria"
        }

        if (!profileData.shippingAddress.trim()) {
            errors.shippingAddress = "La dirección de envío es obligatoria"
        }

        setProfileErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Validar formulario de contraseña
    const validatePasswordForm = () => {
        const errors = {}

        if (!passwordData.currentPassword) {
            errors.currentPassword = "La contraseña actual es obligatoria"
        }

        if (!passwordData.newPassword) {
            errors.newPassword = "La nueva contraseña es obligatoria"
        } else if (passwordData.newPassword.length < 8) {
            errors.newPassword = "La contraseña debe tener al menos 8 caracteres"
        }

        if (!passwordData.confirmPassword) {
            errors.confirmPassword = "Debes confirmar la nueva contraseña"
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden"
        }

        setPasswordErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Actualizar perfil
    const handleUpdateProfile = async (e) => {
        e.preventDefault()

        if (!validateProfileForm()) return

        setIsUpdatingProfile(true)
        try {
            // Excluir el email ya que no se puede actualizar según la API
            const { email, ...updateData } = profileData

            await updateUserProfile(updateData)

            toast({
                variant: "success",
                title: "Perfil actualizado",
                description: "Tus datos han sido actualizados correctamente.",
            })
        } catch (error) {
            console.error("Error al actualizar perfil:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el perfil. Por favor, intenta de nuevo.",
            })
        } finally {
            setIsUpdatingProfile(false)
        }
    }

    // Cambiar contraseña
    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (!validatePasswordForm()) return

        setIsChangingPassword(true)
        try {
            // Llamada a la API para cambiar contraseña
            await fetch("/api/proxy/users/me/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            })

            // Limpiar el formulario
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })

            toast({
                variant: "success",
                title: "Contraseña actualizada",
                description: "Tu contraseña ha sido actualizada correctamente.",
            })
        } catch (error) {
            console.error("Error al cambiar contraseña:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo cambiar la contraseña. Verifica que la contraseña actual sea correcta.",
            })
        } finally {
            setIsChangingPassword(false)
        }
    }

    if (!isAuthenticated) {
        return null // No renderizar nada si no está autenticado (redirigirá en el useEffect)
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="mt-2 text-gray-600">Administra tu información personal y contraseña</p>
            </div>

            {/* Tabs */}
            <div className="mb-8 border-b border-gray-200">
                <div className="flex space-x-8">
                    <button
                        className={`pb-4 px-1 ${
                            activeTab === "profile"
                                ? "border-b-2 border-primary-600 text-primary-600 font-medium"
                                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Información Personal
                    </button>
                    <button
                        className={`pb-4 px-1 ${
                            activeTab === "password"
                                ? "border-b-2 border-primary-600 text-primary-600 font-medium"
                                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("password")}
                    >
                        Cambiar Contraseña
                    </button>
                </div>
            </div>

            {/* Contenido de las tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Tab de Información Personal */}
                {activeTab === "profile" && (
                    <div className="p-6">
                        {isLoadingProfile ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                                <span className="ml-2 text-gray-600">Cargando datos del perfil...</span>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={profileData.firstName}
                                                onChange={handleProfileChange}
                                                className={`w-full text-black px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                    profileErrors.firstName ? "border-red-500" : "border-gray-300"
                                                }`}
                                                placeholder="Tu nombre"
                                            />
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                        {profileErrors.firstName && <p className="mt-1 text-sm text-red-600">{profileErrors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Apellido
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleProfileChange}
                                                className={`w-full px-4  text-black py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                                    profileErrors.lastName ? "border-red-500" : "border-gray-300"
                                                }`}
                                                placeholder="Tu apellido"
                                            />
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        </div>
                                        {profileErrors.lastName && <p className="mt-1 text-sm text-red-600">{profileErrors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                        placeholder="tu@email.com"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">El correo electrónico no se puede modificar</p>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={profileData.birthDate}
                                        onChange={handleProfileChange}
                                        className={`w-full px-4 py-2  text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                            profileErrors.birthDate ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    {profileErrors.birthDate && <p className="mt-1 text-sm text-red-600">{profileErrors.birthDate}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección de Envío
                                    </label>
                                    <textarea
                                        id="shippingAddress"
                                        name="shippingAddress"
                                        value={profileData.shippingAddress}
                                        onChange={handleProfileChange}
                                        rows="3"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                            profileErrors.shippingAddress ? "border-red-500" : "border-gray-300"
                                        }`}
                                        placeholder="Tu dirección completa"
                                    ></textarea>
                                    {profileErrors.shippingAddress && (
                                        <p className="mt-1 text-sm text-red-600">{profileErrors.shippingAddress}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-70"
                                    >
                                        {isUpdatingProfile ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                Actualizando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* Tab de Cambiar Contraseña */}
                {activeTab === "password" && (
                    <div className="p-6">
                        <form onSubmit={handleChangePassword}>
                            <div className="mb-6">
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña Actual
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 text-black py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                            passwordErrors.currentPassword ? "border-red-500" : "border-gray-300"
                                        }`}
                                        placeholder="Ingresa tu contraseña actual"
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordErrors.currentPassword && (
                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4 text-black py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                            passwordErrors.newPassword ? "border-red-500" : "border-gray-300"
                                        }`}
                                        placeholder="Ingresa tu nueva contraseña"
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={`w-full px-4  text-black py-2 pl-10 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                            passwordErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                                        }`}
                                        placeholder="Confirma tu nueva contraseña"
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isChangingPassword}
                                    className="inline-flex text-black items-center bg-primary-600 hover:bg-primary-700   font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-70"
                                >
                                    {isChangingPassword ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            Actualizando...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Cambiar Contraseña
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
