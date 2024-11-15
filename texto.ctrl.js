import textoModel from "./texto.model.js";

export const getTexto = async (req, res) => {
  try {
    const textDB = await textoModel.find();

    res.json({
      respuesta: textDB,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getTextoById = async (req, res) => {
  try {
    const { ide } = req.params;

    // Validar que se proporcione el ID
    if (!ide) {
      return res
        .status(400)
        .json({ error: "El parámetro 'ide' es obligatorio." });
    }

    // Buscar el documento en la base de datos
    const textDB = await textoModel.findById(ide);

    // Validar si el documento existe
    if (!textDB) {
      return res.status(404).json({ error: "Texto no encontrado." });
    }

    // Intentar parsear el contenido a JSON
    let parsedContent;
    try {
      parsedContent = JSON.parse(textDB.content);
    } catch (parseError) {
      return res.status(400).json({
        error: "El contenido almacenado no es un JSON válido.",
      });
    }

    // Responder con los datos parseados
    res.json({
      message: "Texto recuperado con éxito",
      data: parsedContent,
    });
  } catch (error) {
    console.error("Error al obtener texto:", error);
    res.status(500).json({
      error: "Error interno del servidor. Inténtalo nuevamente más tarde.",
    });
  }
};

export const createTexto = async (req, res) => {
  try {
    // Validar que el campo "envio" esté presente
    const { envio } = req.body;
    if (!envio) {
      return res
        .status(400)
        .json({ error: "El campo 'envio' es obligatorio." });
    }

    // Crear una nueva instancia del modelo
    const newText = new textoModel({ content: envio });

    // Guardar el documento en la base de datos
    const textSave = await newText.save();

    // Responder con el documento guardado
    res.status(201).json({
      message: "Texto guardado con éxito",
      data: textSave,
    });
  } catch (error) {
    console.error("Error al crear texto:", error);
    res.status(500).json({
      error: "Error interno del servidor. Inténtalo nuevamente más tarde.",
    });
  }
};

export const createTextoForObjeto = async (req, res) => {
  try {
    const envio = req.body.envio;

    // Validar que "envio" esté presente y sea un objeto o array válido
    if (!envio || typeof envio !== "object") {
      return res.status(400).json({
        error: "El campo 'envio' debe ser un objeto o array válido.",
      });
    }

    // Guardar el contenido como un string JSON en la base de datos
    const newTexto = new textoModel({
      content: JSON.stringify(envio), // Convertir a texto para almacenarlo
    });

    const textSave = await newTexto.save();

    res.status(201).json({
      message: "Contenido creado con éxito",
      data: textSave,
    });
  } catch (error) {
    console.error("Error al crear texto:", error);
    res.status(500).json({
      error: "Error interno del servidor. Inténtalo nuevamente más tarde.",
    });
  }
};
