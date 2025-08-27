// Утиліти для SEO оптимізації

export const generateSitemap = content => {
  const baseUrl = window.location.origin
  const currentDate = new Date().toISOString()

  const urls = [
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      url: `${baseUrl}/#about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      url: `${baseUrl}/#portfolio`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      url: `${baseUrl}/#repertoire`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      url: `${baseUrl}/#contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7',
    },
  ]

  // Додати URL для кожної роботи в портфоліо
  if (content?.portfolio?.works) {
    content.portfolio.works.forEach((work, index) => {
      urls.push({
        url: `${baseUrl}/#portfolio/${work.id || index}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.6',
      })
    })
  }

  return urls
}

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

Sitemap: ${window.location.origin}/sitemap.xml

# Заборонити доступ до адмін панелі
Disallow: /admin
Disallow: /#admin

# Заборонити доступ до тимчасових файлів
Disallow: /temp/
Disallow: /*.tmp$
Disallow: /*.log$`
}

export const getPageTitle = (section, content) => {
  const baseTitles = {
    hero: 'Головна',
    about: 'Про мене',
    portfolio: 'Портфоліо',
    repertoire: 'Відео-репертуар',
    contact: 'Контакти',
  }

  return baseTitles[section] || 'Портфоліо актора'
}

export const getPageDescription = (section, content) => {
  const baseDescriptions = {
    hero:
      content?.hero?.description ||
      'Професійний актор з багаторічним досвідом роботи в театрі та кіно',
    about: 'Біографія, освіта, досвід та професійні навички актора',
    portfolio: 'Галерея фотографій з театральних постановок, кінопроектів та професійних фотосесій',
    repertoire: 'Відеозаписи вистав, кіносцен та професійних виступів',
    contact: 'Контактна інформація для співпраці та бронювання послуг',
  }

  return baseDescriptions[section] || 'Портфоліо професійного актора'
}

export const generateStructuredData = (type, data) => {
  const baseStructure = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'person':
      const structuredData = {
        ...baseStructure,
        '@type': 'Person',
        name: data.name,
        jobTitle: 'Актор',
        description: data.description,
        image: data.image,
        url: data.url,
        nationality: 'Українець',
        worksFor: {
          '@type': 'Organization',
          name: 'Театр та кіноіндустрія',
        },
      }

      // Додаємо персональну інформацію, якщо вона є
      if (data.personalInfo) {
        if (data.personalInfo.birthDate) {
          structuredData.birthDate = data.personalInfo.birthDate
        }
        if (data.personalInfo.birthPlace) {
          structuredData.birthPlace = data.personalInfo.birthPlace
        }
        if (data.personalInfo.height) {
          structuredData.height = {
            '@type': 'QuantitativeValue',
            value: data.personalInfo.height,
            unitCode: 'CMT'
          }
        }
        if (data.personalInfo.languages && data.personalInfo.languages.length > 0) {
          structuredData.knowsLanguage = data.personalInfo.languages.map(lang => ({
            '@type': 'Language',
            name: lang.language,
            proficiencyLevel: lang.level
          }))
        }
        if (data.personalInfo.specialSkills && data.personalInfo.specialSkills.length > 0) {
          structuredData.knowsAbout = data.personalInfo.specialSkills
        }
      }

      return structuredData

    case 'performance':
      return {
        ...baseStructure,
        '@type': 'TheaterEvent',
        name: data.title,
        description: data.description,
        performer: {
          '@type': 'Person',
          name: data.actorName,
        },
        image: data.image,
      }

    case 'creative-work':
      return {
        ...baseStructure,
        '@type': 'CreativeWork',
        name: data.title,
        description: data.description,
        creator: {
          '@type': 'Person',
          name: data.actorName,
        },
        image: data.image,
      }

    default:
      return baseStructure
  }
}
