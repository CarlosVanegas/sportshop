import { NextResponse } from "next/server"

export async function GET(request, context) {
  // Esperar a que se resuelva el objeto params completo
  const params = await context.params
  const path = params.path || []
  const apiPath = path.join("/")
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  const url = `${API_BASE_URL}/${apiPath}`

  console.log(`Proxy: Redirigiendo solicitud GET a ${url}`)

  try {
    // Obtener el token de autorización del encabezado de la solicitud
    const authHeader = request.headers.get("Authorization")

    const headers = {
      "Content-Type": "application/json",
    }

    // Si hay un token de autorización, incluirlo en la solicitud a la API
    if (authHeader) {
      headers["Authorization"] = authHeader
      console.log("Proxy: Incluyendo token de autorización en la solicitud")
    } else {
      console.log("Proxy: No se encontró token de autorización en la solicitud")
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      console.error(`Error en proxy: ${response.status} ${response.statusText}`)
      return NextResponse.json(
          { error: `Error al conectar con la API: ${response.status} ${response.statusText}` },
          { status: response.status },
      )
    }

    const data = await response.json()
    console.log(`Proxy: Respuesta recibida`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en proxy:", error)
    return NextResponse.json({ error: `Error al conectar con la API: ${error.message}` }, { status: 500 })
  }
}

export async function POST(request, context) {
  // Esperar a que se resuelva el objeto params completo
  const params = await context.params
  const path = params.path || []
  const apiPath = path.join("/")
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  const url = `${API_BASE_URL}/${apiPath}`

  console.log(`Proxy: Redirigiendo solicitud POST a ${url}`)

  try {
    // Verificar si hay contenido en el cuerpo de la solicitud
    let body = null
    const contentType = request.headers.get("Content-Type")

    if (contentType && contentType.includes("application/json")) {
      try {
        // Solo intentar parsear el cuerpo si la solicitud tiene contenido
        const text = await request.text()
        if (text && text.trim().length > 0) {
          body = JSON.parse(text)
        }
      } catch (e) {
        console.warn("Error al parsear el cuerpo de la solicitud:", e)
        // Continuar sin body si hay un error de parseo
      }
    }

    // Obtener el token de autorización del encabezado de la solicitud
    const authHeader = request.headers.get("Authorization")

    const headers = {
      "Content-Type": "application/json",
    }

    // Si hay un token de autorización, incluirlo en la solicitud a la API
    if (authHeader) {
      headers["Authorization"] = authHeader
      console.log("Proxy: Incluyendo token de autorización en la solicitud POST")
    } else {
      console.log("Proxy: No se encontró token de autorización en la solicitud POST")
    }

    // Configurar la solicitud
    const fetchOptions = {
      method: "POST",
      headers,
    }

    // Solo añadir el body si existe
    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    console.log("Proxy: Enviando solicitud POST con opciones:", {
      url,
      method: "POST",
      headers: Object.keys(headers),
      hasBody: !!body,
    })

    const response = await fetch(url, fetchOptions)

    console.log(`Proxy: Respuesta POST recibida: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      console.error(`Error en proxy POST: ${response.status} ${response.statusText}`)

      // Intentar obtener detalles del error
      try {
        const errorData = await response.json()
        console.error("Detalles del error:", errorData)
        return NextResponse.json(
            { error: errorData.message || `Error al conectar con la API: ${response.status} ${response.statusText}` },
            { status: response.status },
        )
      } catch (e) {
        return NextResponse.json(
            { error: `Error al conectar con la API: ${response.status} ${response.statusText}` },
            { status: response.status },
        )
      }
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json()
      return NextResponse.json(data)
    } catch (e) {
      console.warn("La respuesta no es JSON válido:", e)
      // Si no hay contenido JSON pero la respuesta es exitosa, devolver éxito
      if (response.ok) {
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ error: `Error al procesar la respuesta: ${e.message}` }, { status: 500 })
      }
    }
  } catch (error) {
    console.error("Error en proxy POST:", error)
    return NextResponse.json({ error: `Error al conectar con la API: ${error.message}` }, { status: 500 })
  }
}

export async function PUT(request, context) {
  // Esperar a que se resuelva el objeto params completo
  const params = await context.params
  const path = params.path || []
  const apiPath = path.join("/")
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  const url = `${API_BASE_URL}/${apiPath}`

  try {
    // Verificar si hay contenido en el cuerpo de la solicitud
    let body = null
    const contentType = request.headers.get("Content-Type")

    if (contentType && contentType.includes("application/json")) {
      try {
        // Solo intentar parsear el cuerpo si la solicitud tiene contenido
        const text = await request.text()
        if (text && text.trim().length > 0) {
          body = JSON.parse(text)
        }
      } catch (e) {
        console.warn("Error al parsear el cuerpo de la solicitud PUT:", e)
        // Continuar sin body si hay un error de parseo
      }
    }

    // Obtener el token de autorización del encabezado de la solicitud
    const authHeader = request.headers.get("Authorization")

    const headers = {
      "Content-Type": "application/json",
    }

    // Si hay un token de autorización, incluirlo en la solicitud a la API
    if (authHeader) {
      headers["Authorization"] = authHeader
      console.log("Proxy: Incluyendo token de autorización en la solicitud PUT")
    } else {
      console.log("Proxy: No se encontró token de autorización en la solicitud PUT")
    }

    // Configurar la solicitud
    const fetchOptions = {
      method: "PUT",
      headers,
    }

    // Solo añadir el body si existe
    if (body) {
      fetchOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      return NextResponse.json(
          { error: `Error al conectar con la API: ${response.status} ${response.statusText}` },
          { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error en proxy PUT:", error)
    return NextResponse.json({ error: `Error al conectar con la API: ${error.message}` }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  // Esperar a que se resuelva el objeto params completo
  const params = await context.params
  const path = params.path || []
  const apiPath = path.join("/")
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  const url = `${API_BASE_URL}/${apiPath}`

  console.log(`Proxy: Redirigiendo solicitud DELETE a ${url}`)

  try {
    // Obtener el token de autorización del encabezado de la solicitud
    const authHeader = request.headers.get("Authorization")

    const headers = {
      "Content-Type": "application/json",
    }

    // Si hay un token de autorización, incluirlo en la solicitud a la API
    if (authHeader) {
      headers["Authorization"] = authHeader
      console.log("Proxy: Incluyendo token de autorización en la solicitud DELETE")
    } else {
      console.warn("Proxy: No se encontró token de autorización en la solicitud DELETE")
    }

    console.log("Proxy: Headers enviados:", JSON.stringify(headers))

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    console.log(`Proxy: Respuesta DELETE recibida: ${response.status} ${response.statusText}`)

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    if (!response.ok) {
      console.error(`Error en proxy DELETE: ${response.status} ${response.statusText}`)
      return NextResponse.json(
          { error: `Error al conectar con la API: ${response.status} ${response.statusText}` },
          { status: response.status },
      )
    }

    try {
      const data = await response.json()
      return NextResponse.json(data)
    } catch (e) {
      // Si no hay contenido JSON, devolver éxito
      return new NextResponse(null, { status: 200 })
    }
  } catch (error) {
    console.error("Error en proxy DELETE:", error)
    return NextResponse.json({ error: `Error al conectar con la API: ${error.message}` }, { status: 500 })
  }
}
