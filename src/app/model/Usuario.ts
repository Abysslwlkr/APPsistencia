export class Usuario {
  public correoDuoc = '';
  public password = '';
  public nombreRegistrado = '';
  public preguntaSecreta = '';
  public respuestaSecreta = '';

  constructor(
     correoDuoc: string,
     password: string,
     nombreRegistrado: string,
     preguntaSecreta: string,
     respuestaSecreta: string){
      this.correoDuoc = correoDuoc;
      this.password = password;
      this.nombreRegistrado = nombreRegistrado;
      this.preguntaSecreta = preguntaSecreta;
      this.respuestaSecreta = respuestaSecreta;

  }
  public listaCorreosRegistrados(): Usuario[] {
    const lista = [];
    lista.push(new Usuario('atorres@duocuc.cl','1234','Ana Torres Leiva',
    '¿Cual es tu animal Favorito?','gato'));
    lista.push(new Usuario('avalenzuela@duocuc.cl','qwer','Alberto Valenzuela Nuñes',
    '¿Nombre de su mejor amigo?','juanito'));
    lista.push(new Usuario('cfuentes@duocuc.cl','asdf','Carla Fuentes Gonzáles',
    '¿Lugar de nacimiento de su madre?','Valparaíso'));
    return lista;
  }

public buscarCorreoRegistrado(correoDuoc: string, password: string): Usuario{
  return this.listaCorreosRegistrados().find(
    usu => usu.correoDuoc === correoDuoc && usu.password === password);

}
public buscarSoloCorreo(correoDuoc: string): Usuario{
  return this.listaCorreosRegistrados().find(
    usuc => usuc.correoDuoc === correoDuoc
  );
}
public respuestaSecret(nombreRegistrado: string, respuestaSecreta: string): Usuario{
  return this.listaCorreosRegistrados().find(
    usur => usur.nombreRegistrado === nombreRegistrado && usur.respuestaSecreta === respuestaSecreta
  );
}

  public validarCorreoDuoc(): string {
    if (this.correoDuoc.trim() === '') {
      return 'Para ingresar al sistema debe ingresar un correo.';
    }
    if (this.correoDuoc.length < 14 || this.correoDuoc.length > 30) {
      return 'El correo debe tener un minimo de 14 caracteres.';
    }
    return '';
  }

  public validarContraseña(): string {
    if (this.password.trim() === '') {
      return 'Para entrar al sistema debe ingresar la contraseña.';
    }

    if (this.password.length !== 4) {
      return 'La contraseña debe ser de 4 caracteres.';
    }
    return '';
  }

  public validarUsuario(): string {
    return this.validarCorreoDuoc()
      || this.validarContraseña();
  }
}
