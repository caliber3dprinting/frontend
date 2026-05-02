import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './src/sanity/env'

export default defineConfig({
  name: 'caliber-3d',
  title: 'Caliber 3D Printing',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            S.listItem().title('Página de Inicio').id('homePage').child(
              S.document().schemaType('homePage').documentId('homePage')
            ),
            S.listItem().title('Página "Sobre Nosotros"').id('aboutPage').child(
              S.document().schemaType('aboutPage').documentId('aboutPage')
            ),
            S.listItem().title('Configuración Global').id('globalConfig').child(
              S.document().schemaType('globalConfig').documentId('globalConfig')
            ),
            S.divider(),
            S.documentTypeListItem('product').title('Productos'),
            S.listItem()
              .title('Categorías de producto')
              .id('product-categories')
              .child(
                S.documentList()
                  .title('Categorías de producto')
                  .schemaType('category')
                  .filter('_type == "category" && categoryType == "product"')
              ),
            S.divider(),
            S.documentTypeListItem('blogPost').title('Blog'),
            S.listItem()
              .title('Categorías de blog')
              .id('blog-categories')
              .child(
                S.documentList()
                  .title('Categorías de blog')
                  .schemaType('category')
                  .filter('_type == "category" && categoryType == "blog"')
              ),
            S.divider(),
            S.documentTypeListItem('testimonial').title('Testimonios'),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
})
