import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import userRepository from '../repositories/UserRepository.js';

const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/;

// Campos que el propio usuario puede editar desde "Mi cuenta"
const editableFields = ['name', 'lastName', 'phoneNumer', 'birthdate', 'url_profile', 'adress', 'email'];

// Datos públicos del usuario (nunca se devuelve el password)
const toDTO = user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    phoneNumer: user.phoneNumer,
    birthdate: user.birthdate,
    age: user.age,
    url_profile: user.url_profile,
    adress: user.adress,
    roles: user.roles.map(r => r.name),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

const httpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

class UserService {

    async getAll() {
        const users = await userRepository.getAll();
        return users.map(toDTO);
    }

    async getById(id) {
        if (!mongoose.isValidObjectId(id)) throw httpError(404, 'Usuario no encontrado');
        const user = await userRepository.findById(id);
        if (!user) throw httpError(404, 'Usuario no encontrado');
        return toDTO(user);
    }

    async updateMe(id, payload) {
        const data = {};
        for (const field of editableFields) {
            if (payload[field] !== undefined) data[field] = payload[field];
        }

        if (data.email) {
            data.email = data.email.trim().toLowerCase();
            const existing = await userRepository.findByEmail(data.email);
            if (existing && String(existing._id) !== String(id))
                throw httpError(400, 'El email ya se encuentra en uso');
        }

        // Cambio de contraseña opcional
        if (payload.password) {
            if (!passwordRequirements.test(payload.password))
                throw httpError(400, 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un dígito y un carácter especial (# $ % & * @)');
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
            data.password = await bcrypt.hash(payload.password, saltRounds);
        }

        try {
            const user = await userRepository.updateById(id, data);
            if (!user) throw httpError(404, 'Usuario no encontrado');
            return toDTO(user);
        } catch (err) {
            if (err.name === 'ValidationError' || err.name === 'CastError') err.status = 400;
            throw err;
        }
    }
}

export default new UserService();
