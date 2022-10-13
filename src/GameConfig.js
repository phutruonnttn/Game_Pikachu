var MW = MW || {};

// Show board
MW.NROWS = 8;
MW.NCOLUMNS = 8;
// Max 32
MW.NTYPES = 8;
// MW.NROWS * MW.NCOLUMNS = MW.NTYPES * MW.N_EACH_OF_TYPE
MW.N_EACH_OF_TYPE = 8;

// Pokemon move
MW.POKEMON_MOVE = 0
MW.MOVE_PARAMS = [
    {"name": "None"},//dont move
    {"name": "Up","splitDirection": 1, "direction": [0]},//move up
    {"name": "Down","splitDirection": 1, "direction": [1]},//move down
    {"name": "Right","splitDirection": 0, "direction": [1]},//move right
    {"name": "Left","splitDirection": 0, "direction": [0]},//move left
    {"name": "Split top, bottom","splitDirection": 1, "direction": [0,1]},//split up and down
    {"name": "Split right, left","splitDirection": 0, "direction": [0,1]},//split right and left
    {"name": "Converge top, bottom","splitDirection": 1, "direction": [1,0]},//converge from top and bottom
    {"name": "Converge right, left","splitDirection": 0, "direction": [1,0]},//converge from right and left
]
MW.DONT_MOVE = 0
MW.MOVE_UP = 1
MW.MOVE_DOWN = 2
MW.MOVE_RIGHT = 3
MW.MOVE_LEFT = 4
MW.SPLIT_UP__DOWN = 5
MW.SPLIT_RIGHT_LEFT = 6
MW.CONVERGE_TOP_BOTTOM = 7
MW.CONVERGE_RIGHT_LEFT = 8

MW.BIG_NUMBER = 99999
MW.FLAG_NUMBER = -2
MW.MIN_STEP_COUNT = 1
MW.MAX_STEP_COUNT = 3
MW.MIN_PATH_LENGTH = 2
MW.MAX_PATH_LENGTH = 4
MW.DURATION_CONNECT_POKEMONS = 0.5
MW.DURATION_FADE_POKEMONS = 0.3
MW.DURATION_MOVE_POKEMONS = 0.2
MW.SPACE_EACH_SIDE = 1

MW.CURRENT_MODE = 0
// Easy mode
MW.INDEX_EASY = 0;
MW.NROWS_EASY = 8;
MW.NCOLUMNS_EASY = 8;
MW.NTYPES_EASY = 8;
MW.N_EACH_OF_TYPE_EASY = 8;

// Normal mode
MW.INDEX_NORMAL = 1;
MW.NROWS_NORMAL = 10;
MW.NCOLUMNS_NORMAL = 10;
MW.NTYPES_NORMAL = 25;
MW.N_EACH_OF_TYPE_NORMAL = 4;

// Hard mode
MW.INDEX_HARD = 2;
MW.NROWS_HARD = 12;
MW.NCOLUMNS_HARD = 12;
MW.NTYPES_HARD = 36;
MW.N_EACH_OF_TYPE_HARD = 4;

// Choose effect
MW.DURATION_CHOOSE_EFFECT = 0.3
MW.REVERT_COLOR = {r:255, g:255, b:255}
MW.EFFECT_COLOR = {r:192, g:192, b:192}
MW.NAME_CHOOSE_POKEMON = "choosePokemon"

// Sound
MW.SOUND_VOLUMN = 0.4
MW.SOUND = true;

// Other config
MW.FLAREY = 445;
MW.SCALE = 1.5;
MW.WIDTH = 480;
MW.HEIGHT = 720;
MW.FONTCOLOR = "#1f2d96";
MW.WHITE_COLOR = "FFFFFF";
MW.menuHeight = 36;
MW.menuWidth = 123;