import { useEffect, useRef } from 'react';
// import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setPrevPage } from '../../store/slices/reference-tracking-slices/prev-page-slice';

type PrevPageTypes = {
  reference_type: string;
  reference_id: string;
};

export function useTrackPrevPage(prevPageData: PrevPageTypes = { reference_type: '', reference_id: '' }) {
  const dispatch = useDispatch();

  const { reference_type, reference_id } = prevPageData;

  dispatch(
    setPrevPage({
      reference_type,
      reference_id,
    })
  );
}
