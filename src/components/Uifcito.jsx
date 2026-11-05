import saludo from '../assets/uifcito/uifcito-saludo.webp'
import despedida from '../assets/uifcito/uifcito-despedida.webp'
import alerta from '../assets/uifcito/uifcito-alerta.webp'
import sorpresa from '../assets/uifcito/uifcito-sorpresa.webp'
import explicando from '../assets/uifcito/uifcito-explicando.webp'
import feliz from '../assets/uifcito/uifcito-feliz.webp'
import pensando from '../assets/uifcito/uifcito-pensando.webp'
import senalando from '../assets/uifcito/uifcito-senalando.webp'
import neutral from '../assets/uifcito/uifcito-neutral.webp'

const poses = {
  saludo: { src: saludo, alt: 'UIFCITO saludando' },
  despedida: { src: despedida, alt: 'UIFCITO despidiéndose con un guiño' },
  alerta: { src: alerta, alt: 'UIFCITO con una señal de advertencia en la pantalla' },
  sorpresa: { src: sorpresa, alt: 'UIFCITO sorprendido con las manos arriba' },
  explicando: { src: explicando, alt: 'UIFCITO explicando con el dedo arriba' },
  feliz: { src: feliz, alt: 'UIFCITO feliz' },
  pensando: { src: pensando, alt: 'UIFCITO pensando' },
  senalando: { src: senalando, alt: 'UIFCITO señalando hacia el contenido' },
  neutral: { src: neutral, alt: 'UIFCITO' },
}

function Uifcito({ pose = 'saludo', variant = 'section' }) {
  const { src, alt } = poses[pose] ?? poses.neutral

  return (
    <img
      className={`uifcito uifcito--${variant}`}
      src={src}
      alt={alt}
      loading={variant === 'hero' ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

export default Uifcito
