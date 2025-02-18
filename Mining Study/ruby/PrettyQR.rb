require 'rqrcode'
require 'chunky_png'
require 'digest/murmurhash'
require 'perlin_noise'

#This function defines the noise algorithm and returns an array of noise as "x"s and " "s
def noiseArray(seed, length)
    interval = 10.0
    seed = Integer(Digest::MD5.hexdigest(seed), 16)
    n2d = Perlin::Noise.new(2, :seed => seed)
    noise = []
    for i in 0..length-1
        noise[i] = []
        o = (i+1)/(interval)
        for j in 0..length-1
            k = (j+1)/(interval)
            if(n2d[o,k] <= 0.50)
                noise[i][j] = "x"
            else
                noise[i][j] = " "
            end
        end
    end
    return noise
end

#this class will represent the various types of cell types and assign a color. 
class CellType
    attr_accessor :color
    def initialize(color)
        @color = color
    end

    def getColor()
        return @color
    end
end

#This class represents the color of the corner and allows other classes to referance and access it wihtout having duplicates.
class Corner
    attr_accessor :color
    def initialize(color)
        @color = color
    end

    def initialize()
        @color = nil;
    end

    def getColor()
        return @color
    end

    def setColor(color)
        @color = color
    end
end

#This class wraps the cell type and its corners together
class Cell
    attr_accessor :type, :ulCorner, :urCorner, :llCorner, :lrCorner
    def initialize(type)
        @type = type
        @ulCorner = Corner.new()
        @urCorner = Corner.new()
        @llCorner = Corner.new()
        @lrCorner = Corner.new()
    end

    def getUL()
        return @ulCorner
    end

    def getUR()
        return @urCorner
    end

    def getLL()
        return @llCorner
    end

    def getLR()
        return @lrCorner
    end

    def getColor()
        return @type.getColor()
    end

    def getType()
        return @type
    end

    def validateCorners()
        if((@ulCorner.getColor() == nil || @urCorner.getColor() == nil || @llCorner.getColor() == nil || @lrCorner.getColor() == nil))
            return false
        else
            return true
        end
    end
end

#This class represents the cell priority types, each PriorityType will be a list of cell types that will be a priority
class PriorityType
    attr_accessor :cellTypes
    def initialize(*cellTypes, background)
        @cellTypes = cellTypes
        @background = background
    end

    def getCellTypes()
        return @cellTypes
    end

    def contains(cellType)
        for i in 0..@cellTypes.length-1
            if(@cellTypes[i] == cellType)
                return true
            end
        end
        return false
    end

    def getBackground()
        return @background
    end
end

#Class CornerCross represents all the 4 corners of a 4 cell cross
class Cross
    attr_accessor :ul, :ur, :ll, :lr, :priorityType
    def initialize(ul, ur, ll, lr, priorityType)
        @ul = ul
        @ur = ur
        @ll = ll
        @lr = lr
        @priorityType = priorityType
    end

    #The following 4 methods are used to get the cell in the corosponding corner of the cross
    def getULCell()
        return @ul
    end

    def getURCell()
        return @ur
    end

    def getLLCell()
        return @ll
    end

    def getLRCell()
        return @lr
    end

    def getPriorityType()
        return @priorityType
    end

    #The following 4 methods are used to get the corner that is touching the cross
    def getULCorner()
        return @ul.getLR()
    end

    def getURCorner()
        return @ur.getLL()
    end

    def getLLCorner()
        return @ll.getUR()
    end

    def getLRCorner()
        return @lr.getUL()
    end

    #TODO fix the corner calculations for background cells where corners with the 3 like neighbors rule doesn't work
    #the following 4 methods will determine the corner colors based on their neighbors
    def calculateConrerUL()
        if(@ul.getType() == @ur.getType() || @ul.getType() == @ll.getType())
            getULCorner.setColor(@ul.getColor())
        else
            if(@priorityType.contains(@ul.getType()) && @ul.getType() == @lr.getType())
                getULCorner.setColor(@ul.getColor())
            else
                if(@ur.getType() == @ll.getType() && priorityType.contains(@ur.getType()))
                    getULCorner.setColor(@ur.getColor())
                else
                    getULCorner.setColor(@priorityType.getBackground.getColor())
                end
            end
        end
    end

    def calculateCornerUR()
        #if follows the side by side rule
        if(@ur.getType() == @ul.getType() || @ur.getType() == @lr.getType())
            getURCorner.setColor(@ur.getColor())
        else
            #if has a priority type and same adjacent
            if(@priorityType.contains(@ur.getType()) && @ur.getType() == @ll.getType())
                getURCorner.setColor(@ur.getColor())
            else
                #if neibors are simmaler and domanaint inherit their color
                #else 
                if(@ul.getType() == @lr.getType() && priorityType.contains(@ul.getType()))
                    getURCorner.setColor(@ul.getColor())
                else
                    getURCorner.setColor(@priorityType.getBackground.getColor())
                end
            end
        end
    end

    def calculateCornerLL()
        if(@ll.getType() == @ul.getType() || @ll.getType() == @lr.getType())
            getLLCorner.setColor(@ll.getColor())
        else
            if(@priorityType.contains(@ll.getType()) && @ll.getType() == @ur.getType())
                getLLCorner.setColor(@ll.getColor())
            else
                if(@ul.getType() == @lr.getType() && priorityType.contains(@ul.getType()))
                    getLLCorner.setColor(@ul.getColor())
                else
                    getLLCorner.setColor(@priorityType.getBackground.getColor())
                end
            end
        end
    end

    def calculateCornerLR()
        #if follows the side by side rule
        if(@ur.getType() == @lr.getType() || @ll.getType() == @lr.getType())
            getLRCorner.setColor(@lr.getColor())
        else
            #if has a priority type and same adjacent
            if(@priorityType.contains(@lr.getType) && @ul.getType() == @lr.getType())
                getLRCorner.setColor(@lr.getColor())
            else
                #if neibors are simmaler and domanaint inherit their color
                #else 
                if(@ur.getType == @ll.getType() && priorityType.contains(@ur.getType))
                    getLRCorner.setColor(@ur.getColor())
                else
                    getLRCorner.setColor(priorityType.getBackground().getColor())
                end
            end 
        end
    end

    def calculateCorners()
        calculateConrerUL()
        calculateCornerUR()
        calculateCornerLL()
        calculateCornerLR()
    end
end

#this function takes a string and turns it into a double array of characters
def s_to_array(string)
    array = string.split("\n")
    for i in 0..array.length-1
        array[i] = array[i].split("")
    end
    return array
end

#Function print_arrays prints the arrays of characters
def print_arrays(array)
    array.each do |row|
        row.each do |column|
            print column
        end
        puts
    end
end

#this class wraps the canvas and renders the qrcode
class Canvas
    #initilize fixed cell sizes. To change the cell size you'll need to reporogram the cell corner paterns
    attr_reader :CellSize, :CornerSize
    CellSize = 66
    CornerSize = 33

    #Initilize static pixel shapes
    @@upperLeftNormalPixels = '_'*16 + 'x'*17 + "\n" +
    '_'*13 + 'x'*20 + "\n" +
    '_'*11 + 'x'*22 + "\n" +
    '_'*9 + 'x'*24 + "\n" +
    '_'*8 + 'x'*25 + "\n" +
    '_'*7 + 'x'*26 + "\n" +
    '_'*6 + 'x'*27 + "\n" +
    '_'*5 + 'x'*28 + "\n" +
    '_'*4 + 'x'*29 + "\n" +
    '_'*3 + 'x'*30 + "\n" +
    '_'*3 + 'x'*30 + "\n" +
    '_'*2 + 'x'*31 + "\n" +
    '_'*2 + 'x'*31 + "\n" +
    '_'*1 + 'x'*32 + "\n" +
    '_'*1 + 'x'*32 + "\n" +
    '_'*1 + 'x'*32 + "\n" +
    ('x'*33 + "\n")*16 + 'x'*33
    @@upperLeftNormalPixels = s_to_array(@@upperLeftNormalPixels)
    
    #flip upper left normal pixels to become lower left normal pixels
    @@lowerLeftNormalPixels = []
    for i in 0..@@upperLeftNormalPixels.length-1
        o = @@upperLeftNormalPixels.length-1 - i
        @@lowerLeftNormalPixels[i] = @@upperLeftNormalPixels[o]
    end

    #flip upper left normal pixels to become upper right normal pixels
    @@upperRightNormalPixels = []
    for i in 0..@@upperLeftNormalPixels.length-1
        o = @@upperLeftNormalPixels.length-1 - i
        @@upperRightNormalPixels[i] = []
        for j in 0..@@upperLeftNormalPixels[o].length-1
            k = @@upperLeftNormalPixels[o].length-1 - j
            @@upperRightNormalPixels[i][j] = @@upperLeftNormalPixels[i][k]
        end
    end

    #flip upper left normal pixels along both axis to become lower right normal pixels
    @@lowerRightNormalPixels = []
    for i in 0..@@upperLeftNormalPixels.length-1
        o = @@upperLeftNormalPixels.length-1 - i
        @@lowerRightNormalPixels[i] = []
        for j in 0..@@upperLeftNormalPixels[o].length-1
            k = @@upperLeftNormalPixels[o].length-1 - j
            @@lowerRightNormalPixels[i][j] = @@upperLeftNormalPixels[o][k]
        end
    end

    def upperLeftNormalPixels
        @@upperLeftNormalPixels
    end
    def upperRightNormalPixels
        @@upperRightNormalPixels
    end
    def lowerLeftNormalPixels
        @@lowerLeftNormalPixels
    end
    def lowerRightNormalPixels
        @@lowerRightNormalPixels
    end

    #initilize the canvas with a width, height, and border all in cells
    attr_accessor :canvas, :width, :height, :border
    def initialize(widthInCells, heightInCells, borderInCells = 3, backgroundColor = ChunkyPNG::Color::WHITE)
        @width = widthInCells
        @height = heightInCells
        @border = borderInCells
        @canvas = ChunkyPNG::Canvas.new(@width*CellSize+@border*CellSize*2, @height*CellSize+@border*CellSize*2, backgroundColor)
    end
    
    #this function renders all 4 corners of a cell on the canvas
    def render(cellX,cellY,cell)
        renderUperLeftNormalCorner(cellX,cellY,cell.getColor(),cell.getUL.getColor())
        renderUperRightNormalCorner(cellX,cellY,cell.getColor(),cell.getUR.getColor())
        renderLowerLeftNormalCorner(cellX,cellY,cell.getColor(),cell.getLL.getColor())
        renderLowerRightNormalCorner(cellX,cellY,cell.getColor(),cell.getLR.getColor())
    end

    #each function renders a normal corner on the canvas
    def renderUperLeftNormalCorner(cellX,cellY,forground,corner)
        xOffset = cellY*CellSize+@border*CellSize
        yOffset = cellX*CellSize+@border*CellSize
        for i in 0..@@upperLeftNormalPixels.length-1
            for j in 0..@@upperLeftNormalPixels[i].length-1
                if @@upperLeftNormalPixels[i][j] == 'x'
                    @canvas[j+xOffset,i+yOffset] = forground
                elsif(@@upperLeftNormalPixels[i][j] == '_')
                    @canvas[j+xOffset,i+yOffset] = corner
                end
            end
        end
    end

    def renderUperRightNormalCorner(cellX,cellY,forground,corner)
        xOffset = cellY*CellSize+@border*CellSize+CornerSize
        yOffset = cellX*CellSize+@border*CellSize
        for i in 0..@@upperRightNormalPixels.length-1
            for j in 0..@@upperRightNormalPixels[i].length-1
                if @@upperRightNormalPixels[i][j] == 'x'
                    @canvas[j+xOffset,i+yOffset] = forground
                elsif(@@upperRightNormalPixels[i][j] == '_')
                    @canvas[j+xOffset,i+yOffset] = corner
                end
            end
        end
    end

    def renderLowerLeftNormalCorner(cellX,cellY,forground,corner)
        xOffset = cellY*CellSize+@border*CellSize
        yOffset = cellX*CellSize+@border*CellSize+CornerSize
        for i in 0..@@lowerLeftNormalPixels.length-1
            for j in 0..@@lowerLeftNormalPixels[i].length-1
                if @@lowerLeftNormalPixels[i][j] == 'x'
                    @canvas[j+xOffset,i+yOffset] = forground
                elsif(@@lowerLeftNormalPixels[i][j] == '_')
                    @canvas[j+xOffset,i+yOffset] = corner
                end
            end
        end
    end

    def renderLowerRightNormalCorner(cellX,cellY,forground,corner)
        xOffset = cellY*CellSize+@border*CellSize+CornerSize
        yOffset = cellX*CellSize+@border*CellSize+CornerSize
        for i in 0..@@lowerRightNormalPixels.length-1
            for j in 0..@@lowerRightNormalPixels[i].length-1
                if @@lowerRightNormalPixels[i][j] == 'x'
                    @canvas[j+xOffset,i+yOffset] = forground
                elsif(@@lowerRightNormalPixels[i][j] == '_')
                    @canvas[j+xOffset,i+yOffset] = corner
                end
            end
        end
    end

    #this function saves the canvas to a file
    def save(fileName)
        @canvas.save(fileName)
    end
end

#returns the locations of a patern in a 2d array
=begin
The array will be iterated by row then column searching for the beggining of the pattern
once the start is found it will check the surroundings cells for each piece of the pattern
=end
def find_pattern(pattern, array)
    locations = []
    row_size = pattern.length
    column_size = pattern[0].length
    if(row_size > array.length || column_size > array[0].length)
        puts 'Pattern is too large for the array'
        return locations
    end
    for i in 0..array.length-row_size
        for j in 0..array[i].length-column_size
            if(array[i][j] == pattern[0][0])
                match = true
                for x in 0..pattern.length-1
                    for y in 0..pattern[x].length-1
                        if(array[i+x][j+y] != pattern[x][y])
                            match = false
                            break
                        end
                    end
                    if match == false
                        break
                    end
                end
                if match 
                    locations.push([i,j])
                end
            end
        end
    end
    return locations
end

#This function will calculate the locations of the individual pieces of the pattern given the locations of the pattern
def find_pattern_pieces(initial_location, pattern)
    locations = []
    for i in 0..pattern.length-1
        for j in 0..pattern[i].length-1
            if(pattern[i][j] == 'x')
                locations.push([initial_location[0]+i,initial_location[1]+j])
            end
        end
    end
    return locations
end

#takes in ARGV[0] and checks to see if its nil
if ARGV[0] == nil
  puts "Usage: ruby test.rb <url> <options>"
  exit
end

#initilize url as argv[0]
url = ARGV[0]
path = 'qr.png'

#checks for additional paramiter and if the quality is present generates based on the quality
if(ARGV[1] == nil)
    qr = RQRCode::QRCode.new(url, :level => :h)
else
    if(ARGV[1] == 'l' || ARGV[1] == 'm' || ARGV[1] == 'q' || ARGV[1] == 'h')
        case ARGV[1]
        when 'l'
            qr = RQRCode::QRCode.new(url, :level => :l)
        when 'm'
            qr = RQRCode::QRCode.new(url, :level => :m)
        when 'q'
            qr = RQRCode::QRCode.new(url, :level => :q)
        when 'h'
            qr = RQRCode::QRCode.new(url, :level => :h)
        end
    else
        puts "Usage: ruby test.rb <url> <quality>: l, m, q, h (default: h)"
        exit
    end
end

#creates a png file with the qr code
qr.as_png(:margin => 0).save("#{path}", :quality => 100)

#splits the string into an arrays of strings by the new line character
text = qr.to_s()
qr_array = text.split("\n")

#iterates through array
for i in 0..qr_array.length-1
  #splits each line into an array of characters
  qr_array[i] = qr_array[i].split("")
    #iterates through each character in the line
    for j in 0..qr_array[i].length-1
        #if the character is a space
        if qr_array[i][j] == " "
            #replace it with a _
            qr_array[i][j] = "_"
        end
    end
end

#initialize the eye patterns
corner_patern = "xxxxxxx\nx_____x\nx_xxx_x\nx_xxx_x\nx_xxx_x\nx_____x\nxxxxxxx"
corner_patern = s_to_array(corner_patern)
small_eye_pattern = "xxxxx\nx___x\nx_x_x\nx___x\nxxxxx"
small_eye_pattern = s_to_array(small_eye_pattern)

#copilot generated patern of what it thinks a lage eye pattern is, it serves no purpose, but I think its neat so I'm going to keep it
large_eye_pattern = "xxxxxxx\nx_____x\nx_xxxxx\nx_____x\nxxxxxxx"
large_eye_pattern = s_to_array(large_eye_pattern)

#initialize the patterns for the eyes
corner_locations = []
small_eye_locations = []

#finds the locations of the corner paterns and small eye paterns
corner_locations = find_pattern(corner_patern, qr_array)
small_eye_locations = find_pattern(small_eye_pattern, qr_array)

#list of all of the corner patern and small eye patern pieces
corner_location_pieces = []
corner_locations.each do |location|
    find_pattern_pieces(location, corner_patern).each do |piece|
        corner_location_pieces.push(piece)
    end
end
small_eye_location_pieces = []
small_eye_locations.each do |location|
    find_pattern_pieces(location, small_eye_pattern).each do |piece|
        small_eye_location_pieces.push(piece)
    end
end

#iterates through the corner location cordinates replaces the cornersqr code with 'c'
corner_location_pieces.each do |location|
    qr_array[location[0]][location[1]] = 'c'
end
#iterates through the eye location cordinates replaces the cornersqr code with 'e'
small_eye_location_pieces.each do |location|
    qr_array[location[0]][location[1]] = 'e'
end

#initialize the types of cells that can be in the qr code
cornerCellType = CellType.new(ChunkyPNG::Color::rgb(133,58,67))
smallEyeCellType = CellType.new(ChunkyPNG::Color::rgb(133,58,67))
backgroundCellType = CellType.new(ChunkyPNG::Color::rgb(255,255,255))
forgroundCellType = CellType.new(ChunkyPNG::Color::rgb(0,0,0))

#intialize the cell type groups
backgroundPriorityType = PriorityType.new(backgroundCellType, backgroundCellType)
forgroundPriorityType = PriorityType.new(forgroundCellType, cornerCellType, smallEyeCellType, backgroundCellType)

#initialize the 2d array of cells with their base black and white colors
cells = Array.new(qr_array.length) { Array.new(qr_array[0].length) }
for i in 0..qr_array.length-1
    for j in 0..qr_array[i].length-1
        case qr_array[i][j]
        when '_' #background
            cells[i][j] = (Cell.new(backgroundCellType))
        when 'x' #forground
            cells[i][j] = (Cell.new(forgroundCellType))
        when 'c' #corner
            cells[i][j] = (Cell.new(cornerCellType))
        when 'e' #small eye
            cells[i][j] = (Cell.new(smallEyeCellType))
        end
    end
end

#initialize 2d array of noise cells
noise = noiseArray(url, qr_array.length-1)

#initialize the 2d array of cross sections. Each cross section is the 4 touching cells
#and determined if there is forground or background priority based off the noise generated
cross = []
for i in 0..qr_array.length-2
    cross[i] = []
    for j in 0..qr_array[i].length-2
        case noise[i][j]
        when "x", "c", "e"
            cross[i][j] = Cross.new(cells[i][j], cells[i][j+1], cells[i+1][j], cells[i+1][j+1], forgroundPriorityType)
        else
            cross[i][j] = Cross.new(cells[i][j], cells[i][j+1], cells[i+1][j], cells[i+1][j+1], backgroundPriorityType)
        end
    end
end

#rounds the edge of the 4 corners of the qr code
cells[0][0].getUL.setColor(backgroundCellType.getColor)
if(cells[0][1].getType == cells[0][0].getType)
    cells[0][0].getUR.setColor(cells[0][0].getColor)
else
    cells[0][0].getUR.setColor(backgroundCellType.getColor)
    puts "There is an error with the corner rounding for the upper left eye"
    raise 'fundemental error'
end
if(cells[1][0].getType == cells[0][0].getType)
    cells[0][0].getLL.setColor(cells[0][0].getColor)
else
    cells[0][0].getLL.setColor(backgroundCellType.getColor)
    puts "There is an error with the corner rounding for the upper left eye"
    raise 'fundemental error'
end
cells[0][cells[0].length-1].getUR.setColor(backgroundCellType.getColor)
if(cells[0][cells[0].length-1].getType == cells[1][cells[0].length-1].getType)
    cells[0][cells[0].length-1].getLR.setColor(cells[0][cells[0].length-1].getColor)
else
    cells[0][cells[0].length-1].getLR.setColor(backgroundCellType.getColor)
    puts "There is an error with the corner rounding for the upper right eye"
    raise 'fundemental error'
end
if(cells[0][cells[0].length-1].getType == cells[0][cells[0].length-2].getType)
    cells[0][cells[0].length-1].getUL.setColor(cells[0][cells[0].length-1].getColor)
else
    cells[0][cells[0].length-1].getUL.setColor(backgroundCellType.getColor)
    puts "There is an error with the corner rounding for the upper right eye"
    raise 'fundemental error'
end
cells[cells.length-1][0].getLL.setColor(backgroundCellType.getColor)
if(cells[cells.length-1][0].getType == cells[cells.length-2][0].getType)
    cells[cells.length-1][0].getUL.setColor(cells[cells.length-1][0].getColor)
else
    cells[cells.length-1][0].getUL.setColor(backgroundCellType.getColor)
    puts "There is an error with the corner rounding for the lower left eye"
    raise 'fundemental error'
end
if(cells[cells.length-1][0].getType == cells[cells.length-1][1].getType)
    cells[cells.length-1][0].getLR.setColor(cells[cells.length-1][0].getColor)
else
    cells[cells.length-1][0].getLR.setColor(backgroundCellType.getColor)
    puts "There is an error with the corner rounding for the lower left eye"
    raise 'fundemental error'
end
#The lower right corner doesn't get error detection because its not an eye
cells[cells.length-1][cells[0].length-1].getLR.setColor(backgroundCellType.getColor)
if(cells[cells.length-1][cells[0].length-1].getType == cells[cells.length-1][cells[0].length-2].getType)
    cells[cells.length-1][cells[0].length-1].getLL.setColor(cells[cells.length-1][cells[0].length-1].getColor)
else
    cells[cells.length-1][cells[0].length-1].getLL.setColor(backgroundCellType.getColor)
end
if(cells[cells.length-1][cells[0].length-1].getType == cells[cells.length-2][cells[0].length-1].getType)
    cells[cells.length-1][cells[0].length-1].getUR.setColor(cells[cells.length-1][cells[0].length-1].getColor)
else
    cells[cells.length-1][cells[0].length-1].getUR.setColor(backgroundCellType.getColor)
end

#flattens the 4 edged of the qr code
#top edge
for i in 1..cells[0].length-2
    #scan top left corner
    if(cells[0][i-1].getType == cells[0][i].getType)
        cells[0][i].getUL.setColor(cells[0][i].getType.getColor)
    else
        cells[0][i].getUL.setColor(backgroundCellType.getColor)
    end
    #scan top right corner
    if(cells[0][i+1].getType == backgroundCellType)
        cells[0][i].getUR.setColor(backgroundCellType.getColor)
    else
        cells[0][i].getUR.setColor(cells[0][i].getType.getColor)
    end
end
#right edge
for i in 1..cells.length-2
    #scan top right corner
    if(cells[i][cells[0].length-1].getType == cells[i-1][cells[0].length-1].getType)
        cells[i][cells[0].length-1].getUR.setColor(cells[i][cells[0].length-1].getColor)
    else
        cells[i][cells[0].length-1].getUR.setColor(backgroundCellType.getColor)
    end
    #scan lower right corner
    if(cells[i][cells[0].length-1].getType == cells[i+1][cells[0].length-1].getType)
        cells[i][cells[0].length-1].getLR.setColor(cells[i][cells[0].length-1].getColor)
    else
        cells[i][cells[0].length-1].getLR.setColor(backgroundCellType.getColor)
    end
end
#bottom edge
for i in 1..cells[cells.length-1].length-2
    #scan lower left corner
    if(cells[cells.length-1][i].getType == cells[cells.length-1][i-1].getType)
        cells[cells.length-1][i].getLL.setColor(cells[cells.length-1][i].getColor)
    else
        cells[cells.length-1][i].getLL.setColor(backgroundCellType.getColor)
    end
    #scan lower right corner
    if(cells[cells.length-1][i].getType == cells[cells.length-1][i+1].getType)
        cells[cells.length-1][i].getLR.setColor(cells[cells.length-1][i].getColor)
    else
        cells[cells.length-1][i].getLR.setColor(backgroundCellType.getColor)
    end
end
#left edge
for i in 1..cells.length-2
    #scan top left corner
    if(cells[i][0].getType == cells[i-1][0].getType)
        cells[i][0].getUL.setColor(cells[i][0].getColor)
    else
        cells[i][0].getUL.setColor(backgroundCellType.getColor)
    end
    #scan lower left corner
    if(cells[i][0].getType == cells[i+1][0].getType)
        cells[i][0].getLL.setColor(cells[i][0].getColor)
    else
        cells[i][0].getLL.setColor(backgroundCellType.getColor)
    end
end

#calculates all of the corners of the reamining cells
for i in 0..cross.length-1
    for j in 0..cross[i].length-1
        cross[i][j].calculateCorners()
    end
end

#test validates that all corners have been calculated
for i in 0..cells.length-1
    for j in 0..cells.length-1
        if(cells[i][j].validateCorners() == false)
            puts "error validating corners"
            raise 'fundemental error'
            exit
        end
    end
end

#initilize a canvas and render all the cells
canvas = Canvas.new(cells[0].length, cells.length,3)
for i in 0..cells.length-1
    for j in 0..cells[i].length-1
        canvas.render(i,j,cells[i][j])
    end
end
canvas.save("PrettyQR.png")

#TODO remove debugging stuff once error is found
testingCanvas = ChunkyPNG::Canvas.new(cells[0].length*7, cells.length*7, ChunkyPNG::Color::rgb(186,191,191))
for i in 0..cells.length-1
    for j in 0..cells[i].length-1
        testingCanvas.rect(j*7,i*7,j*7+6,i*7+6,cells[i][j].getColor,cells[i][j].getColor)
        
        testingCanvas.set_pixel(j*7,i*7,cells[i][j].getUL.getColor)
        testingCanvas.set_pixel(j*7+1,i*7,cells[i][j].getUL.getColor)
        testingCanvas.set_pixel(j*7,i*7+1,cells[i][j].getUL.getColor)
        
        testingCanvas.set_pixel(j*7+6,i*7,cells[i][j].getUR.getColor)
        testingCanvas.set_pixel(j*7+5,i*7,cells[i][j].getUR.getColor)
        testingCanvas.set_pixel(j*7+6,i*7+1,cells[i][j].getUR.getColor)

        testingCanvas.set_pixel(j*7+6,i*7+6,cells[i][j].getLR.getColor)
        testingCanvas.set_pixel(j*7+5,i*7+6,cells[i][j].getLR.getColor)
        testingCanvas.set_pixel(j*7+6,i*7+5,cells[i][j].getLR.getColor)

        testingCanvas.set_pixel(j*7,i*7+6,cells[i][j].getLL.getColor)
        testingCanvas.set_pixel(j*7+1,i*7+6,cells[i][j].getLL.getColor)
        testingCanvas.set_pixel(j*7,i*7+5,cells[i][j].getLL.getColor)

    end
end
testingCanvas.save("testing.png")
