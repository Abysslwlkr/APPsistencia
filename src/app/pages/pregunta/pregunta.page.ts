import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/model/Usuario';
import { AfterViewInit,  ElementRef, ViewChild } from '@angular/core';
import { Animation, AnimationController} from '@ionic/angular';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit {


  public usuario: Usuario;

   constructor(
        private activeroute: ActivatedRoute
      , private router: Router
      , private alertController: AlertController
      , private animationController: AnimationController) {
    this.activeroute.queryParams.subscribe(params => {       
      if (this.router.getCurrentNavigation().extras.state) { 
        this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
        this.usuario.respuestaSecreta= '';
      } else {
        this.router.navigate(['/correcto']);
      }
  });
}
ngOnInit() {
}

public devolver():void{
  const usur =this.usuario.respuestaSecret(
    this.usuario.nombreRegistrado, this.usuario.respuestaSecreta);
    if(usur){
      this.usuario = usur;
      const navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario
        }
      };
      this.router.navigate(['/correcto'], navigationExtras);
    }else{
      this.router.navigate(['/incorrecto']);
    }
}

}

