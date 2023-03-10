import Head from 'next/head'
import Image from 'next/image'
import Layout from "../layout/layout"
import Producto from '@/components/Producto';
import useQuiosco from '@/hooks/useQuiosco';
// import { PrismaClient } from '@prisma/client'


//Se exporta props de categorias
export default function Home() {
    const { categoriaActual } = useQuiosco();

    return (
      <Layout pagina={`Menú ${categoriaActual?.nombre}`}>
        <h1 className='text-4xl font-black'>{categoriaActual?.nombre}</h1>
        <p className='text-2xl my-10'>
          Elige y personaliza tu pedido a continuacion
        </p>

        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {categoriaActual?.productos?.map(producto => (
            <Producto
              key={producto.id}
              producto={producto}
            />
          ))}
        </div>
      </Layout>
    );
}












// //Consulta a BD y extrae categorias
// export const getServerSideProps = async () => {
//   const prisma = new PrismaClient();
  
//   const categorias = await prisma.categoria.findMany()
  
//   return {
//     props: {
//       categorias,
//     }
//   }
// };
