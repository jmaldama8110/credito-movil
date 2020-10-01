import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { UserServiceService } from '@services/user/user-service.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  hide = true;
  form_login: FormGroup;
  loading: any;

  constructor(
    private form: FormBuilder, 
    private userService: UserServiceService,
    private alertController: AlertController,
    private loadingController:LoadingController,
    private translate: TranslateService
    ) {
      localStorage.removeItem("user");
    }

  ngOnInit() {
    this.formLogin();
  }
  formLogin(){
    this.form_login = this.form.group({
      nClient: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{9}$")
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,12}")
      ]]
    });
  }

  login(){
    this.translate.get('WAIT').subscribe(
      value => {
        this.presentLoading(value+"...");
      }
    )
    this.userService.login(this.form_login.value).subscribe(response => {
      this.loading.dismiss();
      this.presentAlert("Datos correctos!","Validacion exitosa.");
      
      //Guardar local
      window.localStorage['user'] = JSON.stringify(response);
    },error=>{
      this.loading.dismiss();
      this.translate.get('LOGINERROR').subscribe(
        value => {
          this.presentAlert("Error!",value);
        }
      )
    })
  }

  async presentAlert(header,msj) {
    const alert = await this.alertController.create({
      header: header,
      message: msj,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(message) {
    this.loading = await this.loadingController.create({
      message,
      cssClass: 'custom-class custom-loading'
    });
    return this.loading.present();
  }
}