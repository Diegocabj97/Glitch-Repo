export const getAll = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({ respuesta: "Ok", mensaje: users });
  } catch (error) {
    res
      .status(404)
      .send({ respuesta: "Error al consultar usuarios", mensaje: error });
  }
};
export const getById = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userModel.findById(uid);
    if (user) {
      res.status(200).send({ respuesta: "Ok", mensaje: user });
    } else {
      res.status(404).send({ respuesta: "Error", mensaje: "User not found" });
    }
  } catch (error) {
    res
      .status(404)
      .send({ respuesta: "Error al consultar este usuario", mensaje: error });
  }
};
export const putById = async (req, res) => {
  const { uid } = req.params;
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const user = await userModel.findByIdAndUpdate(uid, {
      first_name,
      last_name,
      age,
      email,
      password,
    });
    if (user) {
      res.status(200).send({ respuesta: "Ok", mensaje: user });
    } else {
      res.status(404).send({
        respuesta: "Error al actualizar usuario",
        mensaje: "User not found",
      });
    }
  } catch (error) {
    res.status(404).send({ respuesta: "Error", mensaje: error });
  }
};

export const deleteByid = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await userModel.findByuidAndDelete(uid);
    if (user) {
      res.status(200).send({ respuesta: "Ok", mensaje: user });
    } else {
      res.status(404).send({
        respuesta: "Error al eliminar el usuario",
        mensaje: "User not found",
      });
    }
  } catch (error) {
    res.status(404).send({ respuesta: "Error", mensaje: error });
  }
};
