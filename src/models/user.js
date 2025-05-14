const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
    },
    emailId: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email" + "- " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Invalid gender");
        }
      },
    },
    profileImage: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOkAAACUCAMAAABBVf7OAAAAMFBMVEXR1dr////O1Nj39/jN0dfq6+3T1Nrd4OP7+/vv8fLU2NzY2t/a3eHh5Ofl5unr7u9uCFeFAAAELklEQVR4nO2d27arIAxFERARL/3/vz3aYbvbfbRNggjL7XzqI2tAYsiFKnVxcXFxcXFxcZEfbVWY6EOYfudeTDKcU30z1G1rJtq2Hjqbe0lJsKqpW+OrF0x9vn11tm/fRC604WTbGoY1mfdt7U8k1XW3LZ0TXp1Gqh7Nts75AJ9Fqbt91DnRnENq9+HgPkw1dEHD++DwVeeitu5yLzUK23020Tdq5A9OaOlCp32FDZmcqjlCgaW6hicUV6pjGOlCG3IvWoId2UKranC5ly3Afv+SrhDwpGq2ld654Vmq5lvpHbxgqRcd3qoa0TbVMr+lTwyaUsUKj16VormkXmimle+wpOpBKHT6pOZeOxOpmU4uCcz7fs00bFKDuSSpmcIp5VzBf3HDOr2E9NEWbe618+jEQtGU9n9GqewicyktmUspgRrrK/N39jTC99a5184jInJAiwblSsfca+cREfeCKRUnVyrf5F46jyC+n/oeK7sizzkYsDKqFeeRjMWKHGqxR/IjUoeStFKx0OdeP52Ie/hMi3N+JZXTFzyMUnFN5sGltDhc5OnFUWojbqdgSqk9dBsYGKVK/RmlsraVJ7fc66djxXe2OwPOnkbUiWeAokFyW+8qBqqlLibEx0oORhxf3+CY6YzcJ4Hl8MUtZniNr7aX7SpgN75zEqlgKdAFwY0G6wPzRJBjgTPSBb5TqsGy2guab6gjplJ++IA6RcI3VFCHJCgtghWJf3DMHCFaQfGFhud9Pag/UmzvCzdW8QNvhs/jCmVm8xvcw6tY9UXQ+OgJOaME+y19QrySG+yJ+BnbUA6wRyr5b0GauAUbM9iAEj+c4kkS0sgt3oTiCqTSxSmUkuz0HEopcZLPvco9sJRmSQ8fNyhiMdUjVRK3IGW4/RmegwqkIB9tkngNmlK0CtsatBAfNln2g9t8avCNFvx2qsitdSe4tRE78k0Pb6g0hwTVhLQBtYqKnl2xgZzcRpt9+gWjrw6tO+cdzRmFMgFYKm/my6OWTwUvB9WIj/m6TtKN36LN7zkbvrxPvL2tvXVAaq1U54SHeeDWuejZiukKV/626g/vpHO0AuxrE9eD/8CX3Spp1bCPzhlTrNbZPuPmTv/Xqst0wxEvG2xSYnvdTvb5Gz8UdZvTqq93cLjrmDEUMySv1/9nZD+tQxmuyerYwVqC1iKaA+Imu8has5vrzh+WD0xhUz5H7BI53HXM6DKdYa3TOdwNrZnMVfwYcQQZpvtcSO9x1zD90QFid6SFvuKPfcnYHedy/+fQplHxJCKYVP7fqezM7SCpNuKJvZ04yAUL/jdmd45oddHRL+XswREDJ5o5BJOII9pkc31I3/HJJzGy+90H6f2v/M8L9sWk7jSkNmikJ3X/XSmHN/lMeRGfmIW0pZsSooYHSb2vc7nlvZA20C/HTJlTCv8Al+0yb8XbHhEAAAAASUVORK5CYII=",
    },
    about: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Manis#090522", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
