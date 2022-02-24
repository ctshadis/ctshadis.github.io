# Author: Christian Shadis
# Date: 2/22/22
library(leaflet)
library(leaflet.extras)
library(sp)
library(sf)
library(tmap)
library(htmlwidgets)

shape <- read_sf("./data/hunger/Capital_Area_Food_Bank_Hunger_Estimates.shp")
shape <- sf:::as_Spatial(shape)
shape_na <- shape[!is.na(shape$F15_FI_POP),]
fi_pal <- colorNumeric("RdYlGn", domain = shape@data$F15_FI_POP, reverse = TRUE)
un_pal <- colorNumeric("Reds", domain = shape@data$UNEMPLOYME)
pop_pal <- colorNumeric("BuGn", domain = shape@data$TOTAL_POP)

map <- shape %>%
  
  leaflet(options = leafletOptions(minZoom = 9, 
                                   dragging = TRUE, 
                                   maxZoom = 14)) %>%
  
  addProviderTiles(providers$CartoDB.Positron) %>%
  
  addPolygons(weight = 1,
              label = ~paste0("Food-Insecure People: ", F15_FI_POP),
              color = ~fi_pal(F15_FI_POP),
              group = "FoodInsecurity") %>%
  
  addLegend(~F15_FI_POP, group =  "FoodInsecurity", 
            pal = fi_pal, position = "bottomright", 
            opacity = 0.7, title = "# Food-Insecure") %>%
  
  addPolygons(weight = 1,
              label = ~paste0("Unemployment Rate: ", UNEMPLOYME, "\nFood-Insecure People: ", F15_FI_POP),
              color = ~un_pal(UNEMPLOYME),
              group = "UnemploymentRate") %>%
  
  addLegend(~UNEMPLOYME, group = "UnemploymentRate", 
            pal = un_pal, position = "bottomleft", 
            opacity = 0.7, title = "Unemployment\nProp") %>%
  
  addPolygons(weight = 1,
              label = ~paste0("Total Population: ", TOTAL_POP, "\nFood-Insecure People: ", F15_FI_POP),
              color = ~pop_pal(TOTAL_POP),
              group = "Population") %>%
  
  addLegend(~TOTAL_POP, group = "Population", 
            pal = pop_pal, position = "bottomleft", 
            opacity = 0.7, title = "Population") %>%
  
  addLayersControl(baseGroups = c("FoodInsecurity", "UnemploymentRate", "Population")) %>%
  
  setView(lat = 38.9004,lng = -77.0369, zoom = 9) %>%
  
  setMaxBounds(lng1 = -76, 
               lat1 = 38, 
               lng2 = -78, 
               lat2 = 39.5)

saveWidget(map, file="map.html")
map
  