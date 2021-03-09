<template>
    <div class="relative w-full px-14 lg:px-20">
        <h1 class="pt-10 pb-4 text-base font-semibold bg-white font-open text-gray">Evalúa probabilidades con cadenas de Markov</h1>
        <hr>

        <div class="flex items-center align-middle pt-7">
            <p class="text-sm font-poppins text-gray">Ingresa el Tamaño de la matriz de transición: </p>
            <input type="number" v-model="tmatriz" class="font-poppins focus:outline-none focus:ring-2 focus:ring-cm-green w-20 text-sm px-2 py-1.5 ml-2 border border-gray-400 rounded-md">
            <button @click="validateTMatriz" class="w-auto px-4 py-2 ml-2 text-xs font-bold border-none rounded-md bg-cm-green font-poppins hover:bg-green-600 hover:text-white text-gray focus:outline-none focus:ring-2 focus:ring-cm-green">Crear matriz</button>
            <button v-if="displayMatriz" @click="clear" class="w-auto px-4 py-2 ml-2 text-xs font-bold border-none rounded-md bg-cm-green font-poppins hover:bg-green-600 hover:text-white text-gray focus:outline-none focus:ring-2 focus:ring-cm-green">Reset</button>
        </div>

        <!-- matriz -->
        <div v-if="displayMatriz && tmatriz > 1" class="items-center py-5">
            <p class="text-sm font-poppins">Llena la matriz</p>
            <div class="flex width-auto"> 
                <div :class="`mt-4 grid gap-3 grid-flow-col grid-cols-${Number(tmatriz)} grid-rows-${Number(tmatriz)}`">
                    <div v-for="a in Number(tmatriz)*Number(tmatriz)" :key="a" :id="'row'+(a-1)">
                        <input type="number" :id="a" class="text-gray rounded border-gray-400 m-1 border w-16 px-2 font-poppins text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-cm-green" v-model="columnas[a-1]">
                    </div>
                </div>
            </div>
        </div>

        <div v-if="displayMatriz && tmatriz > 1" class="items-center py-5">
            <p class="text-sm font-medium font-poppins">Calcular probabilidad:</p>
            <p class="pb-2 mt-3 text-sm font-poppins">Llena el vector inicial:</p>
            <div class="flex">
                <div v-for="i in Number(tmatriz)" :key="i" :id="'v_pos'+(i-1)">
                    <input type="number" class="text-gray rounded border-gray-400 m-1 border w-16 px-2 font-poppins text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-cm-green" v-model="vectorInicial[i-1]">
                </div>
            </div>
            <p class="pb-2 mt-3 text-sm font-poppins">Cantidad de iteraciones: </p>
            <div class="flex">
                <input type="number" class="text-gray rounded border-gray-400 m-1 border w-14 px-2 font-poppins text-sm py-1.5 focus:outline-none focus:ring-2 focus:ring-cm-green" v-model="cantidadIteraciones">
                <button @click="calcularProbabilidad" class="w-auto px-4 py-2 ml-2 text-xs font-bold border-none rounded-md bg-cm-green font-poppins hover:bg-green-600 hover:text-white text-gray focus:outline-none focus:ring-2 focus:ring-cm-green">Calcular Probabilidad</button>
            </div>
            <div v-if="showResults && resultado != null">
                <p class="pb-2 mt-3 text-sm font-bold font-poppins">Resultados: </p>
                <div v-for="(i, index) in resultado" :key="index" :id="'res'+(i-1)">
                    <strong>{{ index }}</strong>: {{ i }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const { log } = console;

export default {
    data() {
        return {
            tmatriz: null,
            displayMatriz: false,
            columnas: [],
            vectorInicial: [],
            cantidadIteraciones: 0,
            isLoading: false,
            showResults: false,
            resultado: null
        }
    },
    computed: {
        arrayDeColumnas () {
            let subArrays = [];

            for (let i = 0; i < this.columnas.length; i += Number(this.tmatriz)) {
                let column = this.columnas.slice(i, i + Number(this.tmatriz));
                subArrays.push(column)
            }

            return subArrays;
        } 
    },
    methods: {
        validateTMatriz () {
            this.showResults = false;
            this.columnas = [];
            this.vectorInicial = [];
            this.cantidadIteraciones = 0;
            if(Number(this.tmatriz) <= 1 || this.tmatriz == null) {
                this.$swal('El tamaño indicado es inválido. La matriz debe tener un tamaño mayor o igual a 2.')
            } else {
                this.displayMatriz = true;
            }
        },
        calcularProbabilidad() {
            this.isLoading = true;
            //recibe la cantidad de iteraciones y crear un ciclo for que va agregando a un objeto cada uno de los resultados.
            let resultado = {};
            let vectorAMultiplicar = this.vectorInicial;
            for (let i = 0; i < Number(this.cantidadIteraciones); i ++) {
                log("vector a multiplicar: ", vectorAMultiplicar)
                const res = this.multiplicarMatrizXVector(vectorAMultiplicar);
                log("vect res: ", res)
                vectorAMultiplicar = res;
                resultado[`p${i+1}`] = res;
            }

            log("Resultado probabilidad: ", resultado)
            this.isLoading = false;
            this.showResults = true;
            this.resultado = resultado;
        },
        multiplicarMatrizXVector(vector) {
            // Recibe un vector y lo multiplica por cada columna de la matriz. Devuelve un vector.
            log("Valores matriz: ", this.arrayDeColumnas)
            log("Vector: ", vector)
            let resultado = [];

            // Multiplicación cada elemento del vector inicial x cada elemento de cada columna. Cada resultado de cada columna, se incluye al resultado, el tamaño final del vector resultado debe ser igual al tmatriz.
            this.arrayDeColumnas.forEach((v) => {
                let resColumn = 0;
                for(let i = 0; i < Number(this.tmatriz); i++) {
                    //log(`vi[${i}]* v[${i}]: ${vector[i]} * ${v[i]}`)
                    let resTemp = Number(vector[i]) * Number(v[i]);
                    resColumn = resColumn + resTemp;
                }
                log("Resultado pos col: ", resColumn)
                resultado.push(Number(resColumn.toFixed(3)))
            }, vector)
            log("Resultado p: ", resultado)
            return resultado;
        },
        clear () {
            this.displayMatriz = false;
            this.columnas = [];
            this.tmatriz = null;
            this.vectorInicial = [];
            this.resultado = {}
        }
    }

}
</script>