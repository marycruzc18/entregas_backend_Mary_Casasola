import messagesModel from '../../dao/models/messages.model.js';


async function renderChat(req, res) {
  try {
    const messages = await messagesModel.find().sort('-timestamp');
    console.log('Mensajes obtenidos:', messages); // Verificar en la consola
    res.render('chat', { messages });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los mensajes');
  }
}



async function saveMessage(req, res) {
  try {
    const message = new messagesModel({
      user: req.body.user,
      message: req.body.message
    });
    await message.save();
    res.status(201).send('Mensaje enviado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error al enviar el mensaje');
  }
}

export default {
  renderChat,
  saveMessage
};
