import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Produto } from '../interfaces/produto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtoCollection: AngularFirestoreCollection<Produto>;

  constructor(private afs: AngularFirestore) {
    this.produtoCollection = this.afs.collection<Produto>('Produto');
  }

  getProdutos() {
    return this.produtoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        })
      })
    );
  }

  addProduto(produto: Produto) {
    return this.produtoCollection.add(produto);
  }

  getProduto(id: string) {
    return this.produtoCollection.doc<Produto>(id).valueChanges();
  }

  updateProduto(id: string, produto: Produto) {
    return this.produtoCollection.doc<Produto>(id).update(produto);
  }

  deleteProduto(id: string) {
    return this.produtoCollection.doc(id).delete();
  }
}
