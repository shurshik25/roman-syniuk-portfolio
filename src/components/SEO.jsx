import { Helmet } from 'react-helmet-async'
import { generateStructuredData } from '../utils/seo'

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Актор',
  locale = 'uk_UA',
  personalInfo = null,
}) => {
  const defaultTitle = 'Портфоліо актора - Професійні ролі в театрі та кіно'
  const defaultDescription =
    'Портфоліо професійного актора з досвідом роботи в театрі, кіно та телебаченні. Перегляньте мої ролі, фотографії та відео виступів.'
  const defaultKeywords = 'актор, театр, кіно, портфоліо, ролі, виступи, Україна'
  const defaultImage = '/images/portfolio/profile.jpg'
  const siteUrl = window.location.origin

  const seoTitle = title ? `${title} | ${defaultTitle}` : defaultTitle
  const seoDescription = description || defaultDescription
  const seoKeywords = keywords || defaultKeywords
  const seoImage = image ? `${siteUrl}${image}` : `${siteUrl}${defaultImage}`
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl

  return (
    <Helmet>
      {/* Основні meta теги */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph теги */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Портфоліо актора" />

      {/* Twitter Card теги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Structured Data для актора */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData('person', {
          name: author,
          description: seoDescription,
          image: seoImage,
          url: seoUrl,
          personalInfo: personalInfo
        }))}
      </script>

      {/* PWA теги */}
      <meta name="theme-color" content="#8b5cf6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Портфоліо актора" />

      {/* Viewport та performance */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    </Helmet>
  )
}

export default SEO
