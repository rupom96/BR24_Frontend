/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from '@tsparticles/engine';
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from '@tsparticles/slim'; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AccountCircle } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/Redux/store/store';
import {
  LoginShell,
  getLoginParticleTheme,
  loginFieldSx,
  loginLabelSx,
} from '../../components/LoginShell';

const API_BASE_URL = window.API_BASE_URL;
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

type Props = {};

const LoginUsernameLayer = (props: Props) => {
  const { register, getValues, reset, control, setValue } = useForm();

  const [showPasswordLayer, setShowPasswordLayer] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const currentColor = useAppSelector((state) => state.currentColor.color);
  const isDark = currentMode === 'Dark';
  dispatch(setNavbarShow(false));
  dispatch(setPanelShow(false));

  const [init, setInit] = useState(false);
  const particleTheme = getLoginParticleTheme(isDark, currentColor);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      // await loadAll(engine);
      // await loadFull(engine);
      await loadSlim(engine);
      // await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      autoPlay: true,
      background: {
        color: {
          value: particleTheme.background,
        },
        // image:
        //   "url('http://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/1237px-NASA_logo.svg.png')",
        // position: '50% 50%',
        // repeat: 'no-repeat',
        // size: '20%',
        // opacity: 1,
      },
      backgroundMask: {
        composite: 'destination-out',
        cover: {
          color: {
            value: '#fff',
          },
          opacity: 1,
        },
        enable: false,
      },
      clear: true,
      defaultThemes: {},
      delay: 0,
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      detectRetina: true,
      duration: 0,
      fpsLimit: 48,
      interactivity: {
        detectsOn: 'window',
        events: {
          onClick: {
            enable: true,
            mode: 'repulse',
          },
          onDiv: {
            selectors: [],
            enable: false,
            mode: [],
            type: 'circle',
          },
          onHover: {
            enable: true,
            mode: 'bubble',
            parallax: {
              enable: false,
              force: 2,
              smooth: 20,
            },
          },
          resize: {
            delay: 0.5,
            enable: true,
          },
        },
        modes: {
          trail: {
            delay: 1,
            pauseOnStop: false,
            quantity: 1,
          },
          attract: {
            distance: 200,
            duration: 0.4,
            easing: 'ease-out-quad',
            factor: 1,
            maxSpeed: 50,
            speed: 1,
          },
          bounce: {
            distance: 200,
          },
          bubble: {
            distance: 250,
            duration: 2,
            mix: false,
            opacity: 0,
            size: 0,
            divs: {
              distance: 200,
              duration: 0.4,
              mix: false,
              selectors: [],
            },
          },
          connect: {
            distance: 80,
            links: {
              opacity: 0.5,
            },
            radius: 60,
          },
          grab: {
            distance: 400,
            links: {
              blink: false,
              consent: false,
              opacity: 1,
            },
          },
          push: {
            default: true,
            groups: [],
            quantity: 4,
          },
          remove: {
            quantity: 2,
          },
          repulse: {
            distance: 400,
            duration: 0.4,
            factor: 100,
            speed: 1,
            maxSpeed: 50,
            easing: 'ease-out-quad',
            divs: {
              distance: 200,
              duration: 0.4,
              factor: 100,
              speed: 1,
              maxSpeed: 50,
              easing: 'ease-out-quad',
              selectors: [],
            },
          },
          slow: {
            factor: 3,
            radius: 200,
          },
          light: {
            area: {
              gradient: {
                start: {
                  value: '#ffffff',
                },
                stop: {
                  value: '#000000',
                },
              },
              radius: 1000,
            },
            shadow: {
              color: {
                value: '#000000',
              },
              length: 2000,
            },
          },
        },
      },
      manualParticles: [],
      particles: {
        bounce: {
          horizontal: {
            value: 1,
          },
          vertical: {
            value: 1,
          },
        },
        collisions: {
          absorb: {
            speed: 2,
          },
          bounce: {
            horizontal: {
              value: 1,
            },
            vertical: {
              value: 1,
            },
          },
          enable: true,
          maxSpeed: 200,
          mode: 'bounce',
          overlap: {
            enable: false,
            retries: 2,
          },
        },
        color: {
          value: particleTheme.particle, // particle color !!!!
          animation: {
            h: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0,
            },
            s: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0,
            },
            l: {
              count: 0,
              enable: false,
              speed: 1,
              decay: 0,
              delay: 0,
              sync: true,
              offset: 0,
            },
          },
        },
        effect: {
          close: true,
          fill: true,
          options: {},
          type: [],
        },
        groups: {},
        move: {
          angle: {
            offset: 0,
            value: 90,
          },
          attract: {
            distance: 200,
            enable: false,
            rotate: {
              x: 3000,
              y: 3000,
            },
          },
          center: {
            x: 50,
            y: 50,
            mode: 'percent',
            radius: 0,
          },
          decay: 0,
          distance: {},
          direction: 'none',
          drift: 0,
          enable: true,
          gravity: {
            acceleration: 19.81,
            enable: false,
            inverse: false,
            maxSpeed: 400,
          },
          path: {
            clamp: true,
            delay: {
              value: 0,
            },
            enable: false,
            options: {},
          },
          outModes: {
            default: 'out',
            bottom: 'out',
            left: 'out',
            right: 'out',
            top: 'out',
          },
          random: false,
          size: false,
          speed: {
            min: 0.1,
            max: 1,
          },
          spin: {
            acceleration: 0,
            enable: false,
          },
          straight: false,
          trail: {
            enable: false,
            length: 10,
            fill: {},
          },
          vibrate: false,
          warp: false,
        },
        number: {
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
          limit: {
            mode: 'delete',
            value: 0,
          },
          value: isDark ? 55 : 40,
        },
        opacity: {
          value: {
            min: 0.15,
            max: isDark ? 0.85 : 0.55,
          },
          animation: {
            count: 0,
            enable: true,
            speed: 1,
            decay: 0,
            delay: 0,
            sync: false,
            mode: 'auto',
            startValue: 'random',
            destroy: 'none',
          },
        },
        reduceDuplicates: false,
        shadow: {
          blur: 0,
          color: {
            value: '#000',
          },
          enable: false,
          offset: {
            x: 0,
            y: 0,
          },
        },
        shape: {
          close: true,
          fill: true,
          options: {},
          type: 'circle',
        },
        size: {
          value: {
            min: 1,
            max: 3,
          },
          animation: {
            count: 0,
            enable: false,
            speed: 5,
            decay: 0,
            delay: 0,
            sync: false,
            mode: 'auto',
            startValue: 'random',
            destroy: 'none',
          },
        },
        stroke: {
          width: 0,
        },
        zIndex: {
          value: 0,
          opacityRate: 1,
          sizeRate: 1,
          velocityRate: 1,
        },
        destroy: {
          bounds: {},
          mode: 'none',
          split: {
            count: 1,
            factor: {
              value: 3,
            },
            rate: {
              value: {
                min: 4,
                max: 9,
              },
            },
            sizeOffset: true,
            particles: {},
          },
        },
        roll: {
          darken: {
            enable: false,
            value: 0,
          },
          enable: false,
          enlighten: {
            enable: false,
            value: 0,
          },
          mode: 'vertical',
          speed: 25,
        },
        tilt: {
          value: 0,
          animation: {
            enable: false,
            speed: 0,
            decay: 0,
            sync: false,
          },
          direction: 'clockwise',
          enable: false,
        },
        twinkle: {
          lines: {
            enable: false,
            frequency: 0.05,
            opacity: 1,
          },
          particles: {
            enable: true,
            frequency: 4,
            opacity: 1,
          },
        },
        wobble: {
          distance: 5,
          enable: false,
          speed: {
            angle: 50,
            move: 10,
          },
        },
        life: {
          count: 0,
          delay: {
            value: 0,
            sync: false,
          },
          duration: {
            value: 0,
            sync: false,
          },
        },
        rotate: {
          value: 0,
          animation: {
            enable: false,
            speed: 0,
            decay: 0,
            sync: false,
          },
          direction: 'clockwise',
          path: false,
        },
        orbit: {
          animation: {
            count: 0,
            enable: false,
            speed: 1,
            decay: 0,
            delay: 0,
            sync: false,
          },
          enable: false,
          opacity: 1,
          rotation: {
            value: 45,
          },
          width: 1,
        },
        links: {
          blink: false,
          color: {
            value: particleTheme.link,
          },
          consent: false,
          distance: 130,
          enable: true,
          frequency: 1,
          opacity: isDark ? 0.35 : 0.28,
          shadow: {
            blur: 5,
            color: {
              value: '#000',
            },
            enable: false,
          },
          triangles: {
            enable: false,
            frequency: 1,
          },
          width: 1,
          warp: false,
        },
        repulse: {
          value: 0,
          enabled: false,
          distance: 1,
          duration: 1,
          factor: 1,
          speed: 1,
        },
      },
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      responsive: [],
      smooth: true,
      style: {},
      themes: [],
      zLayers: 100,
      name: 'NASA',
      motion: {
        disable: false,
        reduce: {
          factor: 4,
          value: true,
        },
      },
    }),
    [isDark, particleTheme.background, particleTheme.particle, particleTheme.link]
  );

  // if (init) {
  //   return (
  //     <Particles
  //       id="tsparticles"
  //       particlesLoaded={particlesLoaded}
  //       options={options}
  //     />
  //   );
  // }

  const btnNext = () => {
    const userName = getValues().user;

    console.log('userName');
    console.log(userName);

    if (!userName) {
      toast.info('Enter a valid username');
      return;
    }

    // call ajax if userName exists!!
    // jodi exist na kore kore, then alert 'userName/Email/PhoneNumber isn't registered'
    // jodi exist kore, then save the userName in local storage, jeno uporer useEffect e localStorage theke j valid user name read kora hoy oita jeno paay, then navigate to 'loginPassword'

    const sendingObj = {
      userName,
      emailAddress: userName,
      phone: userName,
    };

    setLoading(true);
    axios
      .get(`${API_BASE_URL}/Login/isUserExist`, {
        params: sendingObj,
      })
      .then((res) => {
        console.log('insert er axios!!');
        if (res.data) {
          const userInfo = {
            userName,
            emailAddress: userName,
            phone: userName,
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          navigate('/loginPassword');
        } else {
          toast.error('Username/Email/Phone is not registered!');
        }
      })
      .catch((error) => {
        // Handle error
        toast.error(`something wrong in backend: ${error}`);
        console.error(`something wrong in backend: ${error}`);
      })
      .finally(() => {
        setLoading(false); // Set loading state to false when axios finishes
      });

    // navigate('/loginPassword');
  };

  return (
    <>
      <Particles
        id="tsparticles-username"
        particlesLoaded={particlesLoaded}
        options={options}
      />

      <LoginShell
        title="Username"
        subtitle="Secure access to your operations workspace — sign in to continue."
        footer={
          <button
            type="button"
            className="br24-login-cta"
            onClick={btnNext}
            disabled={loading}
          >
            {loading && <CircularProgress size={14} color="inherit" />}
            {loading ? 'Please wait…' : 'Continue'}
          </button>
        }
      >
        <FormControl sx={{ width: '100%' }} size="small" variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-username"
            sx={loginLabelSx(isDark)}
          >
            User or Email or Phone
          </InputLabel>
          <OutlinedInput
            {...register('user')}
            id="outlined-adornment-username"
            type="text"
            endAdornment={
              <InputAdornment position="end">
                <AccountCircle
                  sx={{ color: isDark ? 'rgba(148,163,184,0.9)' : '#64748b' }}
                />
              </InputAdornment>
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                btnNext();
              }
            }}
            label="User or Email or Phone"
            sx={loginFieldSx(isDark, currentColor)}
          />
        </FormControl>
      </LoginShell>
    </>
  );
};

export default LoginUsernameLayer;
