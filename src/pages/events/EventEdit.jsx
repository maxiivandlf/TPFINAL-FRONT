import {
  Box,
  TextField,
  FormControl,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { updateEvent, getEventId } from '../../api/services/eventServices';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { parseISO, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { typeEvents } from '../../constants/typesEvents';
import { useNavigate, useParams } from 'react-router-dom';

function EventEdit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm();
  const [event, setEvent] = useState(null);
  const [formStatus, setFormStatus] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  const onSubmit = handleSubmit(async (data) => {
    const newEvent = {
      name: data.name,
      type: data.type,
      dateEvent: data.dateEvent,
      lat: data.lat,
      long: data.long,
      description: data.description,
      imageURL: data.imageURL ? data.imageURL[0] : undefined,
    };

    try {
      const res = await updateEvent(id, newEvent);

      if (res.status === 200) {
        setFormStatus('success');
        confetti({
          particleCount: 200,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 200,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
        reset();
        navigate('/eventos');
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus(error);
    }
  });

  const getEvent = async () => {
    setIsLoading(true);
    const res = await getEventId(id);
    if (res.status === 200) {
      setEvent(res.data);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getEvent();
  }, []);

  return (
    <>
      {!isLoading && event !== null && (
        <FormControl
          fullWidth
          sx={{
            backgroundColor: 'var(--color-primary-600)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <Box component={'form'} onSubmit={onSubmit}>
            <Grid container direction={'row'} spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  id='name'
                  label='Nombre'
                  name='name'
                  variant='outlined'
                  defaultValue={event?.name}
                  fullWidth
                  minLength={2}
                  error={errors.name ? true : false}
                  helperText={errors.name?.message}
                  {...register('name', {
                    required: {
                      value: true,
                      message: 'El nombre es requerido',
                    },
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener mas de 2 caracteres',
                    },
                    maxLength: {
                      value: 50,
                      message: 'El nombre debe tener menos de 50 caracteres',
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel id='type'>Tipo de evento</InputLabel>
                  <Select
                    fullWidth
                    labelId='type'
                    id='type'
                    defaultValue={event?.type}
                    name='type'
                    label='Tipo de evento'
                    error={errors.type ? true : false}
                    {...register('type', {
                      required: {
                        value: true,
                        message: 'El tipo de evento es requerido',
                      },
                    })}
                  >
                    {typeEvents.map((type) => (
                      <MenuItem key={type.type} value={type.value}>
                        {type.type}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type && (
                    <FormHelperText error={true}>
                      {errors.type.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  id='dateEvent'
                  type='datetime-local'
                  name='dateEvent'
                  variant='outlined'
                  fullWidth
                  error={errors.dateEvent ? true : false}
                  helperText={errors.dateEvent?.message}
                  {...register('dateEvent', {
                    required: {
                      value: true,
                      message: 'La fecha es requerida',
                    },
                    validate: (value) => {
                      const dateEvent = format(
                        parseISO(value),
                        'yyyy/MM/dd HH:mm'
                      );
                      const dateNow = format(new Date(), 'yyyy/MM/dd HH:mm');
                      if (dateEvent <= dateNow) {
                        return 'La fecha debe ser mayor a la actual';
                      }
                      return true;
                    },
                  })}
                />
              </Grid>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  margin: 2,
                  width: { sx: '100%', md: '46%' },
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Roboto',
                    color: 'var(--color-surface-300)',
                    marginBottom: '5px',
                  }}
                >
                  Ubicación
                </label>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    margin: 2,
                    width: { sx: '100%', md: '46%' },
                  }}
                >
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      id='lat'
                      label='Latitud'
                      name='lat'
                      type='text'
                      variant='outlined'
                      fullWidth
                      defaultValue={event?.lat}
                      error={errors.lat ? true : false}
                      helperText={errors.lat?.message}
                      {...register('lat', {
                        required: {
                          value: true,
                          message: 'La latitud es requerida',
                        },

                        pattern: {
                          value: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
                          message: 'La latitud debe estar entre -90 y 90',
                        },
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      id='long'
                      label='Longitud'
                      name='long'
                      error={errors.long ? true : false}
                      type='text'
                      variant='outlined'
                      defaultValue={event?.long}
                      fullWidth
                      helperText={errors.long?.message}
                      {...register('long', {
                        required: {
                          value: true,
                          message: 'La longitud es requerida',
                        },
                        pattern: {
                          value:
                            /^[-+]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)$/,
                          message: 'La longitud debe estar entre -180 y 180',
                        },
                      })}
                    />
                  </Grid>
                </Box>
              </Box>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  id='description'
                  label='Descripcion del evento'
                  name='description'
                  variant='outlined'
                  error={errors.description ? true : false}
                  multiline
                  fullWidth
                  defaultValue={event?.description}
                  helperText={errors.description?.message}
                  minRows={4}
                  {...register('description', {
                    required: {
                      value: true,
                      message: 'La descripcion es requerida',
                    },
                    maxLength: {
                      value: 200,
                      message:
                        'La descripcion debe tener menos de 200 caracteres',
                    },
                    minLength: {
                      value: 10,
                      message: 'La descripcion debe tener mas de 10 caracteres',
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Roboto',
                    color: 'var(--color-surface-300)',
                    marginBottom: '5px',
                  }}
                  htmlFor='imageURL'
                >
                  Imagen/banner del evento (archivos jpg o png)
                </label>
                <TextField
                  id='imageURL'
                  name='image'
                  type='file'
                  variant='outlined'
                  fullWidth
                  helperText={errors.imageURL?.message}
                  {...register('imageURL', {
                    validate: () => {
                      const file = watch('imageURL');

                      if (!file || file.length === 0) {
                        setValue('imageURL', null);
                        return true;
                      } else if (
                        file[0].type !== 'image/jpeg' &&
                        file[0].type !== 'image/png'
                      ) {
                        return 'Debe ser un archivo jpg o png';
                      }
                      return true;
                    },
                  })}
                />
              </Grid>
            </Grid>

            {isSubmitting === true ? (
              <CircularProgress />
            ) : (
              <Button type='submit' variant='contained' sx={{ marginY: 2 }}>
                Editar evento 🎊
              </Button>
            )}

            {formStatus === 'error' && errors.length !== 0 && (
              <Alert severity='error'>
                A ocurrido un Error, intente nuevamente
              </Alert>
            )}
          </Box>
        </FormControl>
      )}
    </>
  );
}

export default EventEdit;
