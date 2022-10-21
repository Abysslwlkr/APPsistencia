import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/Usuario';


@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit {


  public usuario: Usuario;

  constructor(private router: Router, private toastController: ToastController) {
    this.usuario = new Usuario('','','','','');
    this.usuario.respuestaSecreta = '';
 
  }
  ngOnInit() {
    this.usuario.correoDuoc = '@duocuc.cl';
  }

  public recuperar(): void {

  const usuc =this.usuario.buscarSoloCorreo(
    this.usuario.correoDuoc);
    if(usuc){
      this.usuario = usuc;
      this.mostrarMensaje('Correo Encontrado')
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario
        }
      };
      this.router.navigate(['/pregunta'], navigationExtras);
    }
    else{
      this.mostrarMensaje('Correo no se encuentra en la base de datos');
    }
  }

  public validarUsuario(usuario: Usuario): boolean {

    const mensajeError = usuario.validarUsuario();

    if (mensajeError) {
      this.mostrarMensaje(mensajeError);
      return false;
    }

    return true;
  }
  async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }
}
