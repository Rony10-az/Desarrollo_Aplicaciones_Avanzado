import connectDB from "./src/db/database.js";
import postRepository from "./src/repositories/postRepository.js";
import userRepository from "./src/repositories/userRepository.js";
connectDB(); //Conexión a la base de datos


try {
    const user = await userRepository.create({
        email: "rony.quintana@tecsup.edu.pe",
        name: "Rony ",
        lastName: "Quintana Llanque"
    });
    console.log("Usuario creado: ", user);
    postRepository.create({
        title: "Hello",
        content: "Hi, this is my first post!",
        user: user._id
    });
    const users = await userRepository.findAll();
    console.log("Usuarios actuales: ", users);
    const posts = await postRepository.findAll();
    console.log("Posts registrados: ", posts)
} catch (error) {
    console.log("Error: ", error);
}