import { Component, OnInit } from '@angular/core';
import { Produto } from 'src/app/interfaces/produto';
import { Subscription } from 'rxjs';
import { ProdutoService } from 'src/app/services/produto.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private produtos = new Array<Produto>();
  private produtosSubscription: Subscription;
  private loading: any;

  constructor(
    private produtoService: ProdutoService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) {
    this.produtosSubscription = this.produtoService.getProdutos().subscribe(data => {
      this.produtos = data;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.produtosSubscription.unsubscribe();
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduto(id: string) {
    try {
      this.presentLoading();
      await this.produtoService.deleteProduto(id);
      this.loading.dismiss();
    } catch(error) {
      this.presentToast(error.message);
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Por favor, aguarde...'
    });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
