//Se importan datos desde data
import { categorias } from './data/categorias'
import { productos } from './data/productos'

import { PrismaClient } from '@prisma/client'

//Crea instancia
const prisma = new PrismaClient()
//Conecta a BD y adjunta el listado a BD
const main = async () : Promise<void> => {
    try{
        await prisma.categoria.createMany({
            data: categorias
        })

        await prisma.producto.createMany({
            data: productos
        })

    } catch (error) {
        console.log(error)
    }
}

main()