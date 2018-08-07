import { createStore } from 'redux';
import labAnimal from './reducer.js';

var store = createStore(labAnimal);
export default store;
