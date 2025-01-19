#! /usr/bin/env ruby
# frozen_string_literal: true

# This code was generated with the help of ChatGPT, a language processing model trained by OpenAI.

require 'nokogiri'
require 'open-uri'
require_relative 'food'
require_relative 'generate_html'
require_relative 'get_image'

fruits_list = ['ABRICOT', 'ANANAS', 'BANANE', 'CERISE', 'CITRON', 'CITRON VERT',
               'CLÉMENTINE', 'COING', 'DATTE', 'FIGUE', 'FRAISE', 'FRAMBOISE', 'FRUIT DE LA PASSION', 'GRENADE',
               'GROSEILLE', 'KAKI', 'KIWI', 'LIMON', 'LITCHI', 'MANDARINE', 'MANGUE', 'MELON',
               'MIRABELLES', 'MÛRE', 'MYRTILLE', 'NOISETTE', 'NOIX', 'ORANGE', 'PAMPLEMOUSSE', 'PECHE', 'POIRE',
               'POMME', 'PRUNE', 'RAISIN',]

vegetables_list = ['AIL', 'ARTICHAUT', 'ASPERGE', 'AUBERGINE', 'AVOCAT',
                   'BASILIC', 'BETTERAVE', ' BETTE', 'BROCOLI',
                   'CAROTTE', 'CELERI', 'CÈPE', 'CERFEUIL', 'CHAMPIGNON', 'CHANTERELLE', 'CHAYOTTE', ' CHICORÉE',
                   'CHOU', 'CHOU-FLEUR', 'CHOU-RAVE', 'CIBOULETTE', 'CONCOMBRE', 'CORNICHON', 'COURGE', ' COURGETTE',
                   'CRESSON', 'CÈPE', 'ÉCHALOTE', 'ENDIVE', 'ÉPINARD', 'FENOUIL', 'GINGEMBRE', 'GIROLLE', ' HARICOT',
                   'HERBE', 'HUILE', 'LAITUE', 'MÂCHE', 'NAVET', 'OIGNON', 'PATATE', 'POIREAU', 'POMME DE TERRE',
                   'POTIRON', 'RADIS', 'RHUBARBE', 'ROQUETTE', 'SALADE', 'SALSIFIS', 'TOMATE',
                   'TOPINAMBOUR', 'TOURNESOL', 'TURBOT', 'VINAIGRE', ' WAKAME',]

desc 'Scrape website and generate HMTML'
task :web_scraper do
  # URL to scrape
  page = Nokogiri::HTML(URI.parse('https://rnm.franceagrimer.fr/prix?M0123:MARCHE').open)

  # Array to store the Fruit objects
  fruits =      []
  vegetables =  []

  page.css('table tr').each do |row|
    name = row.css('td:nth-child(1)').text.strip
    price = row.css('td:nth-child(2)').text.strip
    varia = row.css('td:nth-child(3)').text.strip
    min = row.css('td:nth-child(4)').text.strip
    max = row.css('td:nth-child(5)').text.strip

    # Check that the price contains only numbers
    next unless /^[0-9]/.match?(price)
    name_short = name.scan(/\b[A-ZÀ-Ý]+\b/).join('%20')
    name_short = name_short.gsub('%20I', '').gsub('%20X', '').gsub('%20B', '').gsub('AOP', '')
    if vegetables_list.any? { |vegetable| name.include?(vegetable) }
      name_short += '%20LEGUME'
      vegetables << Food.new(name, price, varia, min, max, get_image_url(name_short))
    elsif fruits_list.any? { |fruit| name.include?(fruit) }
      name_short += '%20FRUIT'
      fruits << Food.new(name, price, varia, min, max, get_image_url(name_short)) if !name.include?('POMME DE TERRE')
    end
  end

  generate_html(vegetables, 'vegetables.html')
  generate_html(fruits, 'fruits.html')
end
