var Board = {
    n_rows: 10,
    n_columns: 10,
    _pokemons: {},

    ctor: function (n_rows, n_column, n_types, count){
        this.n_rows = n_rows;
        this.n_columns = n_column;

        for (var i = 0; i < n_rows; i++){
            this._pokemons[i] = [];
            for (var j = 0; j < n_column; j++){
                this._pokemons[i][j] = -1;
            }
        }

        var countType = {};
        for (var i = 0; i< n_types; i++) {
            countType[i] = 0;
        }
        for (var i = 0; i < n_rows; i++) {
            for (var j = 0; j < n_column; j++) {
                var type;
                do {
                    type = Math.random() % n_types;
                } while (countType[type] >= count[type]);
                countType[type]++;
                this.addPokemon(i,j,type+1)
            }
        }
    },

    getNRows: function (){
        return this.n_rows;
    },

    getNColumns: function (){
        return this.n_columns;
    },

    addPokemon: function (x,y,type){
        this._pokemons[x][y] = type;
    },

    getPokemon: function (x,y){
        return this._pokemons[x][y];
    },

    removePokemon: function (x,y){
        this._pokemons[x][y] = -1;
    }
}