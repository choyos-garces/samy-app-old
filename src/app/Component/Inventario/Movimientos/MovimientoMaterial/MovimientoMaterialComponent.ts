import {Component, EventEmitter, Output} from "angular2/core";
import {ControlGroup, FormBuilder, Validators, Control} from "angular2/common";

import {MaterialModel} from "../../../../Model/Administracion/MaterialModel";
import {MaterialesService} from "../../../../Service/Administracion/MaterialesService";
import {MovimientoMaterialModel} from "../../../../Model/Inventario/MovimientoMaterialModel";
import {SimpleKey} from "../../../../Model/SimpleKey";
import {FilterSimpleKey} from "../../../../Pipes/FilterSimpleKey";

@Component({
    selector : "movimiento-material",
    pipes : [FilterSimpleKey],
    directives : [],
    template : `<div class="form-group">
        <label class="control-label col-sm-3" for="movimientoInventarioMaterial">Materiales</label>
        <div class="col-sm-9 col-md-7">
            <div class="input-group">
                <div class="input-group-btn select-group">
                    <select class="form-control" id="movimientoInventarioMaterial" [(ngModel)]="tipoMaterial">
                        <option *ngFor="#opcion of tiposMaterial" [value]="opcion.id">{{ opcion.label }}</option>
                    </select>
                </div>
                <div class="input-group-btn select-group">
                    <select class="form-control" id="movimientoInventarioMaterial" [(ngModel)]="material" (ngModelChange)="objectToFormControl($event, 'materiales', 'material')">
                        <option *ngFor="#opcion of materiales | filterSimpleKey : 'number' : 'tipo' : tipoMaterial" [value]="opcion.id">{{ opcion.nombre }}</option>
                    </select>
                </div>
                <input type="number" placeholder="Cantidad" step="0.01" min="0" class="form-control" id="movimientoInventarioCantidad" [(ngFormControl)]="movimietoMaterial.controls['cantidad']" />
                <div class="input-group-btn">            
                    <button class="btn btn-primary" (click)="enviarMaterial()" [disabled]="!disableEnvio()"><i class="fa fa-check"></i></button>
                </div>
            </div>
        </div>
    </div>`
})
export class MovimientoMaterialComponent {
    @Output() agregarMaterial = new EventEmitter();
    movimietoMaterial : ControlGroup;
    materiales :MaterialModel[];
    tiposMaterial : SimpleKey[];
    tipoMaterial; //Temporary Model
    material; //Temporary Model
    
    constructor(public _formBuilder : FormBuilder, public _materailesService : MaterialesService) {
        this.materiales = this._materailesService.materiales;
        this.tiposMaterial = this._materailesService.tiposMaterial;

        this.movimietoMaterial = this._formBuilder.group({
            material : [null, Validators.required],
            cantidad : [null, Validators.required]
        });
    }

    disableEnvio() {
        return this.movimietoMaterial.valid;
    }

    enviarMaterial() {
        if(this.movimietoMaterial.valid) {
            var mm = this.movimietoMaterial.value;
            this.agregarMaterial.emit( new MovimientoMaterialModel(null, mm.material, mm.cantidad) );

            this.movimietoMaterial.controls["cantidad"].updateValue(null, {});
            this.material = null;
        }
    }

    objectToFormControl(id, collection, control) : void {
        const result = this[collection].filter((item : any) => item.id == id );

        this.movimietoMaterial.controls[control].updateValue((result.length == 1) ? result[0] : null);
    }
}