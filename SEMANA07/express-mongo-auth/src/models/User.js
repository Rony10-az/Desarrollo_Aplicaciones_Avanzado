import mongoose from 'mongoose';

const passwordRequirements = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/;
const bcryptHash = /^\$2[aby]\$\d{2}\$[./A-Za-z\d]{53}$/;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: value => bcryptHash.test(value) || passwordRequirements.test(value),
            message: 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un dígito y un carácter especial (# $ % & * @)'
        }
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }],
    name: {
        type: String
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumer: {
        type: String,
        required: true,
        trim: true
    },
    birthdate: {
        type: Date,
        required: true,
        validate: {
            validator: value => value <= new Date(),
            message: 'La fecha de nacimiento no puede ser futura'
        }
    },
    url_profile: {
        type: String,
        trim: true
    },
    adress: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

UserSchema.virtual('age').get(function () {
    if (!this.birthdate) return null;
    const today = new Date();
    let age = today.getFullYear() - this.birthdate.getFullYear();
    const birthdayHasNotOccurred =
        today.getMonth() < this.birthdate.getMonth() ||
        (today.getMonth() === this.birthdate.getMonth() &&
            today.getDate() < this.birthdate.getDate());

    if (birthdayHasNotOccurred) age--;
    return age;
});

export default mongoose.model('User', UserSchema);
