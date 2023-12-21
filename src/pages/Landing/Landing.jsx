import { useEffect, useState } from 'react';
import { Header, Button, MediaCard } from '../../components';
import styles from './Landing.module.css';
import encuentro from '../../assets/encuentro_informatico.jpg';
import * as getEventsThunk from '../../redux/thunks/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, Pagination, Grid } from '@mui/material';

const handleClick = () => {
  console.log('Ver mas detalles del evento');
};

function Landing() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { isLoading, events, totalPages } = useSelector(
    (state) => state.events
  );
  const handleChangePage = (event, value) => {
    setPage(value);
    dispatch(getEventsThunk.getEvents(value, 2));
  };
  useEffect(() => {
    dispatch(getEventsThunk.getEvents(1, 2));
  }, [dispatch]);
  return (
    <div className={styles.landingContainer}>
      <Header />

      <section className={styles.banner}>
        <div className={styles.blur}>
          <img className={styles.image} src={encuentro} alt='' />
          <div className={styles.contentText}>
            <h2>XIX Encuentro Informático Riojano</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam
              fugiat provident explicabo illum quibusdam incidunt quo ut maxime
              adipisci voluptatem?
            </p>
            <Button
              width={'170px'}
              type={'button'}
              title={'Ver más'}
              action={handleClick}
            />
          </div>
        </div>
      </section>
      <section className={styles.uncomingEvents}>
        <h2 style={{ color: 'white' }}>Proximos eventos</h2>
        <Grid
          container
          gap={3}
          alignItems={'center'}
          justifyContent={'center'}
          margin={3}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          ) : (
            events.map((event) => (
              <Grid key={event._id} item md={4} marginX={2}>
                <MediaCard
                  description={event.description}
                  title={event.name}
                  imageURL={event.imageURL || '/default.jpg'}
                  idEvent={event._id}
                  dateValue={event.dateEvent}
                />
              </Grid>
            ))
          )}
        </Grid>
        <Pagination
          count={totalPages}
          color='secondary'
          sx={{ borderRadius: '50px', margin: 2 }}
          page={page}
          onChange={handleChangePage}
        />
      </section>
    </div>
  );
}

export default Landing;
