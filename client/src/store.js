import { createStore } from 'redux';
import labAnimal from './reducers';

var store = createStore(labAnimal);
export default store;
