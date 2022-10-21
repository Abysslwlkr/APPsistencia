import { Component, OnInit,ElementRef,ViewChild,AfterViewInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/Usuario';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {

  @ViewChild('titulo', { read: ElementRef, static: true}) titulo: ElementRef;
  public usuario: Usuario;

  constructor(private router: Router, private toastController: ToastController,private animationController: AnimationController) {
    this.usuario = new Usuario('','','','','');
    this.usuario.correoDuoc = '';
    this.usuario.password = '';
  }

  public ngOnInit(): void {

    this.usuario.correoDuoc = '@duocuc.cl';
    this.usuario.password = '';
  }

  public ingresar(): void {

    if(!this.validarUsuario(this.usuario)) {
      return;
  }
  const usu =this.usuario.buscarCorreoRegistrado(
    this.usuario.correoDuoc, this.usuario.password);
    if(usu){
      this.usuario = usu;
      this.mostrarMensaje('Bienvenido!');
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario
        }
      };
      this.router.navigate(['/home'], navigationExtras);
    }else{
      this.mostrarMensaje('Correo o Contraseña incorrecto');
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
  public ngAfterViewInit(): void {
    const animation = this.animationController
      .create()
      .addElement(this.titulo.nativeElement)
      .iterations(Infinity)
      .duration(10000)
      .fromTo('transform', 'translate(0%)', 'translate(100%)')
      .fromTo('opacity', 0.2, 1);
    animation.play();
  }

}
