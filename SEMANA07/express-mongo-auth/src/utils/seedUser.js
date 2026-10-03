import bcrypt from 'bcrypt';
import roleRepository from '../repositories/RoleRepository.js';
import userRepository from '../repositories/UserRepository.js';

const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/;

export default async function seedUser() {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD;
    const existing = await userRepository.findByEmail(email);

    if (existing) {
        console.log(`Admin user already exists: ${email}`);
        return existing;
    }

    // Sin contraseña por defecto: el administrador solo se crea con ADMIN_PASSWORD definido en .env
    if (!password || !passwordRequirements.test(password)) {
        throw new Error(
            'Define ADMIN_PASSWORD en .env para crear el administrador inicial ' +
            '(mínimo 8 caracteres, una mayúscula, un dígito y un carácter especial # $ % & * @).'
        );
    }

    let adminRole = await roleRepository.findByName('admin');
    if (!adminRole) {
        adminRole = await roleRepository.create({ name: 'admin' });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const admin = await userRepository.create({
        email,
        password: hashedPassword,
        name: process.env.ADMIN_NAME || 'Admin',
        lastName: process.env.ADMIN_LAST_NAME || 'User',
        phoneNumer: process.env.ADMIN_PHONE || '000000000',
        birthdate: new Date(process.env.ADMIN_BIRTHDATE || '1990-01-01'),
        url_profile: process.env.ADMIN_PROFILE_URL || '',
        adress: process.env.ADMIN_ADDRESS || '',
        roles: [adminRole._id]
    });

    console.log(`Seeded admin user: ${email}`);
    return admin;
}
