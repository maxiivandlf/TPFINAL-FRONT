import {
  MediaCard,
  ButtomFilter,
  FormCreateEvent,
  PopUp,
} from '../../components';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import * as EventsThunk from '../../redux/thunks/thunks';
import { useEffect } from 'react';
import useEventFilter from '../../hooks/useEventFilter';

function Events() {
  const { events, isLoading } = useSelector((state) => state.events);
  const { filteredEvents, filterCriteria, updateFilterCriteria, resetFilters } =
    useEventFilter(events);
  const dispatch = useDispatch();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilterCriteria(name, value);
  };

  useEffect(() => {
    dispatch(EventsThunk.getEvents());
  }, [dispatch]);
  return (
    <Box component={'main'}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <PopUp>
          <FormCreateEvent />
        </PopUp>
        <Typography
          variant='h4'
          align='center'
          fontWeight={600}
          color={'#f5167e'}
          textTransform={'uppercase'}
          paddingY={3}
          width={'100%'}
        >
          Eventos{' '}
        </Typography>
      </Box>
      <Box component={'section'}>
        <Box
          component={'header'}
          width={'100%'}
          display={'flex'}
          justifyContent={'end'}
          alignItems={'end'}
        >
          <ButtomFilter
            filterCriteria={filterCriteria}
            handleFilterChange={handleFilterChange}
            resetFilter={resetFilters}
          />
        </Box>

        <Grid container gap={3} alignItems={'center'} justifyContent={'center'}>
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                minHeight: '50vh',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {events.length !== 0 && !isLoading
            ? filteredEvents.map((event) => (
                <Grid key={event._id}>
                  <MediaCard
                    description={event.description}
                    title={event.name}
                    idEvent={event._id}
                    imageURL={event.imageURL || '/default.jpg'}
                    dateValue={event.dateEvent}
                  />
                </Grid>
              ))
            : !isLoading && (
                <Box
                  sx={{
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant='h5'
                    align='center'
                    fontWeight={600}
                    color={'#f5167e'}
                    textTransform={'uppercase'}
                    paddingY={3}
                    width={'100%'}
                  >
                    No Tienes Eventos
                  </Typography>
                </Box>
              )}
        </Grid>
      </Box>
    </Box>
  );
}

export default Events;
