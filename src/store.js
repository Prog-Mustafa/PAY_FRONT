import { createStore, action } from 'easy-peasy';

const store = createStore({
    login: true,
    updateLogin: action((state, payload) => {
        state.login = payload;
    }),
});;

export default store;