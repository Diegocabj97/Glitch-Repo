import passport from "passport";
//Funcion para retornar errores

export const passportError = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorization = (rol) => {
  //rol = 'Admin' desde ruta 'Crear Producto'
  return async (req, res, next) => {
    console.log("Rol del usuario: ", req.user.user.role);
    console.log("Se autoriza solo a los: ", rol);
    if (!req.user) {
      return res.status(401).send({ error: "User no autorizado" });
    }
    if (req.user.user.role != rol) {
      return res
        .status(403)
        .send({ error: "Usuario no tiene los permisos necesarios" });
    }
    next();
  };
};
