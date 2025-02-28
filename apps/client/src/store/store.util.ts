import { useDispatch, useSelector } from 'react-redux';

import { store } from './store';

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
