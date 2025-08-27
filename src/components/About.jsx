
import { motion } from 'framer-motion'
import { useContent } from '../hooks/useContent'

const About = () => {
  const { content } = useContent()

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 select-none">
            Про <span className="text-gradient select-none">{content.hero.name}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto select-none">
            Професійний актор з Хмельницького, який поєднує акторську майстерність з талантом
            створення цифрового контенту
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Photo Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              <img
                src={content.hero.profileImage}
                alt={`${content.hero.name} - Професійна фотографія`}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-500 rounded-full opacity-20"></div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Biography */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 select-none">Біографія</h3>
              <p className="text-gray-600 leading-relaxed select-none">{content.about.biography}</p>
            </div>

            {/* Personal Information */}
            {content.about.personalInfo && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 select-none">Персональна інформація</h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {content.about.personalInfo.age && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 min-w-[60px] select-none">Вік:</span>
                        <span className="text-gray-600 select-none">{content.about.personalInfo.age} років</span>
                      </div>
                    )}
                    {content.about.personalInfo.height && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 min-w-[60px] select-none">Зріст:</span>
                        <span className="text-gray-600 select-none">{content.about.personalInfo.height} см</span>
                      </div>
                    )}
                    {content.about.personalInfo.weight && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 min-w-[60px] select-none">Вага:</span>
                        <span className="text-gray-600 select-none">{content.about.personalInfo.weight} кг</span>
                      </div>
                    )}
                  </div>

                  {/* Birth Place - Full width for long text */}
                  {content.about.personalInfo.birthPlace && (
                    <div className="flex items-start space-x-2 text-sm">
                      <span className="font-medium text-gray-900 min-w-[140px] flex-shrink-0 select-none">Місце народження:</span>
                      <span className="text-gray-600 select-none">{content.about.personalInfo.birthPlace}</span>
                    </div>
                  )}

                  {/* Physical Characteristics */}
                  <div className="space-y-3 text-sm">
                    {content.about.personalInfo.eyeColor && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 min-w-[120px] select-none">Колір очей:</span>
                        <span className="text-gray-600 select-none">{content.about.personalInfo.eyeColor}</span>
                      </div>
                    )}
                    {content.about.personalInfo.hairColor && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 min-w-[120px] select-none">Колір волосся:</span>
                        <span className="text-gray-600 select-none">{content.about.personalInfo.hairColor}</span>
                      </div>
                    )}
                    {content.about.personalInfo.physique && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 min-w-[120px] select-none">Статура:</span>
                        <span className="text-gray-600 select-none">{content.about.personalInfo.physique}</span>
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  {content.about.personalInfo.languages && content.about.personalInfo.languages.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 select-none">Знання мов:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {content.about.personalInfo.languages.map((lang, index) => (
                          <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <span className="font-medium text-gray-900 select-none">{lang.language}</span>
                            <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full select-none">
                              {lang.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Special Skills */}
                  {content.about.personalInfo.specialSkills && content.about.personalInfo.specialSkills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 select-none">Спеціальні навички:</h4>
                      <div className="flex flex-wrap gap-2">
                        {content.about.personalInfo.specialSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full select-none"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clothing Sizes - if available */}
                  {(content.about.personalInfo.shirtSize || content.about.personalInfo.pantsSize || content.about.personalInfo.shoeSize) && (
                    <div className="space-y-3 text-sm">
                      <h4 className="font-semibold text-gray-900 select-none">Розміри одягу:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {content.about.personalInfo.shirtSize && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 min-w-[80px] select-none">Сорочка:</span>
                            <span className="text-gray-600 select-none">{content.about.personalInfo.shirtSize}</span>
                          </div>
                        )}
                        {content.about.personalInfo.pantsSize && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 min-w-[80px] select-none">Штани:</span>
                            <span className="text-gray-600 select-none">{content.about.personalInfo.pantsSize}</span>
                          </div>
                        )}
                        {content.about.personalInfo.shoeSize && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 min-w-[80px] select-none">Взуття:</span>
                            <span className="text-gray-600 select-none">{content.about.personalInfo.shoeSize}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {content.about.personalInfo.drivingLicense && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 select-none">Водійські права</span>
                      </div>
                    )}
                    {content.about.personalInfo.passportStatus && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 select-none">{content.about.personalInfo.passportStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Education */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 select-none">Освіта</h3>
              <div className="space-y-3">
                {content.about.education.map((edu, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 select-none">{edu.institution}</h4>
                      <p className="text-gray-600 select-none">{edu.degree}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 select-none">Досвід</h3>
              <div className="space-y-3">
                {content.about.experience.map((exp, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 select-none">{exp.title}</h4>
                      <p className="text-gray-600 select-none">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 select-none">Навички</h3>
              <div className="grid grid-cols-2 gap-3">
                {content.about.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600 select-none">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 select-none">Досягнення</h3>
              <div className="space-y-3">
                {content.about.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 select-none">{achievement.title}</h4>
                      <p className="text-gray-600 select-none">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
