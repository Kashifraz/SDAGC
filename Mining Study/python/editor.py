from tkinter import *
from tkinter import font
from breakpoint import BreakPoint
import json

class Editor(Frame):
    def __init__(self, master=None, **kw) -> None:
        Frame.__init__(self, master, kw)
        # set current font
        self.fontstyle = "Cascadia Code"

        self.tarfsinpixs = 35
        self.color_breakpoint = 'red'
        self.fontcolor_comment = 'brown'
        self.fontcolor_label = 'green'
        self.fontcolor_default = 'black'

        #try load editor settings
        try:
            configfile = open('settings.json')
            data = json.load(configfile)
            self.fontstyle = str(data['fontfamily'])
            self.tarfsinpixs = int(data['fontsize'])
            self.fontcolor_default = str(data['fontcolor_default'])
            self.fontcolor_comment = str(data['fontcolor_comment'])
            self.fontcolor_label = str(data['fontcolor_label'])
            self.color_breakpoint = str(data['color_breakpoint'])
            configfile.close()
        except:
            pass

        # create a proxy for the underlying widget
        self.twidget = Text(self, kw, wrap='none', undo=TRUE, foreground=self.fontcolor_default)
        self.twidget.place(x=100, relwidth=0.8, relheight=0.9, anchor='nw')
        self.twidget._orig = self.twidget._w + "_orig"
        self.twidget.tk.call("rename", self.twidget._w, self.twidget._orig)
        self.twidget.tk.createcommand(self.twidget._w, self._proxy)

        self.img_breakpoint = PhotoImage(file="res/breakpoint.png")
        self.img_none = PhotoImage(width=self.tarfsinpixs, height=self.tarfsinpixs)
        
        self.tcanvas = Canvas(self)
        self.tcanvas.place(relx=0, width=100, relheight=0.9, anchor='nw')
        #self.tcanvas.bind("<Configure>", lambda event: self.tcanvas.configure(scrollregion=self.tcanvas.bbox("all")))       
        self.wbtnbreakpoints = []

        self.yscrollbar = Scrollbar(orient=VERTICAL, command=self.scrollbarcallback)
        self.yscrollbar.place(relx=1, rely=0.05, relheight=0.95, anchor='ne')
        self.xscrollbar = Scrollbar(orient=HORIZONTAL, command=self.twidget.xview)
        self.xscrollbar.place(relx=0.6, rely=1, relwidth=0.4, anchor='sw')
        self.twidget.configure(yscrollcommand=self.textmousescroolcallback, xscrollcommand=self.xscrollbar.set) 

        tmpfs, tmpls = self.getfontsizeforpixels(self.fontstyle, self.tarfsinpixs)
        self.twidget.configure(font=(self.fontstyle, tmpfs))
        self.btnhei = tmpls
        tmpfslc, tmplslc = self.getfontsizeforpixels(self.fontstyle, 25)
        self.lcfs = tmpfslc
        self.twidget.tags = []
        self.twidget.bind('<<TextModified>>', self.textmodifiedcallback)
        self.twidget.bind('<Tab>', self.tab)
        self.tlines = self.twidget.get('1.0', 'end').split('\n')
        self.twidget.tag_configure("breakpoint", background=self.color_breakpoint)
        self.twidget.tag_configure("comment", foreground=self.fontcolor_comment)
        self.twidget.tag_configure("label", foreground=self.fontcolor_label)

        self.cbtnbreakpoints = 0
    
        self.twindows = []
        
        self.activebreakpoints = []
        self.updatebtnbreakpoint()

        self.shouldchasebreakpoint = True
    
    def calculatetags(self, loffstart:int=0, loffend:int=None) -> None:
        up_str = f'{loffstart+1}.0'
        up_end = 'end'
        if (loffend != None):
            up_end = f'{loffend}.0 lineend'
        
        for id, siders in self.twidget.tags:
            self.twidget.tag_remove(id, up_str, up_end)
        self.twidget.tag_remove('comment', up_str, up_end)
        self.twidget.tag_remove('label', up_str, up_end)

        lines = (self.twidget.get('1.0', 'end').split('\n'))
        lines = lines[loffstart:loffend]
        lc = loffstart
        for line in lines:
            lc += 1
            #check comment
            oc = line.find(';')
            if (oc != -1):
                self.twidget.tag_add('comment', f'{lc}.{oc}', f'{lc}.{0} lineend')
                line = line[0:oc]
            #check label
            ol = line.find(':')
            if (ol != -1):
                self.twidget.tag_add('label', f'{lc}.0' ,f'{lc}.{ol}')
            line = line.upper()
            for t_id, t_idnstrs in self.twidget.tags:
                for idnstr in t_idnstrs:
                    tl = line
                    l = tl.find(idnstr)
                    to = 0
                    while  (l != -1):
                        tl = tl[(l+len(idnstr)):]
                        if (to+l == 0):
                            if (len(idnstr) == len(line)):
                                self.twidget.tag_add(t_id, f'{lc}.{to+l}', f'{lc}.{to+l+len(idnstr)}')
                            elif (line[len(idnstr)] == ' ' or line[len(idnstr)] == ','):
                                self.twidget.tag_add(t_id, f'{lc}.{to+l}', f'{lc}.{to+l+len(idnstr)}')
                        elif (to+l == len(line)-len(idnstr) and (line[to+l-1] == " " or line[to+l-1] == ",")):
                            self.twidget.tag_add(t_id, f'{lc}.{to+l}', f'{lc}.{to+l+len(idnstr)}')
                        elif ((line[to+l-1] == ' ' or line[to+l-1] == ',')and (line[to+l+len(idnstr)] == ' ' or line[to+l+len(idnstr)] == ',')):
                            self.twidget.tag_add(t_id, f'{lc}.{to+l}', f'{lc}.{to+l+len(idnstr)}')
                        to += l + len(idnstr)
                        l = tl.find(idnstr)

    def createtag(self, tag_idnstrs, tag_id, **kw) -> None:
        self.twidget.tag_configure(tag_id, kw)
        self.twidget.tags.append((tag_id, tag_idnstrs))
        self.calculatetags()

    def _proxy(self, command, *args):
        cmd = (self.twidget._orig, command) + args
        result = self.twidget.tk.call(cmd)
        if command in ("insert", "delete", "replace"):
            self.twidget.event_generate("<<TextModified>>")
        return result

    def textmodifiedcallback(self, event=None) -> None:
        _tmp_lines = self.tlines
        self.tlines = self.twidget.get('1.0', 'end').split('\n')
        #print(self.tlines)
        #print(_tmp_lines)
        clines = len(self.tlines)
        if (clines > len(_tmp_lines)):
            self.calculatetags(len(_tmp_lines), clines)
            #print(f'updated new tags from line {len(_tmp_lines)} to {clines}.\n')
            clines = len(_tmp_lines)

        ul_start = 0
        ubool = False
        for i in range(clines):
            if (_tmp_lines[i] == self.tlines[i]):
                    if(ubool):
                        #print(f'updated tags from line {ul_start} to {i}.\n')
                        self.calculatetags(ul_start, i)
                    ul_start = i+1
                    ubool = False
            else:
                ubool = True
        if (ubool == True):
            #print(f'updated remaining tags from line {ul_start} to {clines}.\n')
            self.calculatetags(ul_start, clines)
        self.updatebtnbreakpoint()
        #print(self.__nolines(), len(self.twindows))

    def updatebreakpoint(self, line:int) -> None:
        if (line != 0):
            self.removebreakpoint()
            self.twidget.tag_add('breakpoint', f'{line}.0', f'{line}.0 lineend')
        if (self.shouldchasebreakpoint):
            self.moveviewtoline(line)

    def removebreakpoint(self) -> None:
        self.twidget.tag_remove('breakpoint', '1.0', 'end')
    
    def tab(self, event=None):
        self.twidget.insert(INSERT, "  ")
        return "break"
    
    def getlines(self):
        return self.tlines
    
    def enable(self):
        self.twidget.config(state='normal')
    
    def disable(self):
        self.twidget.config(state='disabled')
    
    def __nolines(self):
        return len(self.tlines) - 1
    
    def scrollbarcallback(self, x, y):
        self.twidget.yview(x, y)
        self.tcanvas.yview(x, y)

    def textmousescroolcallback(self, x, y):
        self.yscrollbar.set(x, y)
        self.tcanvas.yview('moveto', x)
    
    def updatebtnbreakpoint(self):
        tclines = self.__nolines()
        if self.cbtnbreakpoints != tclines:
            if (self.cbtnbreakpoints > tclines):
                for i in range(tclines, self.cbtnbreakpoints):
                    self.wbtnbreakpoints[i][2].reset()
                    o = self.twindows.pop()
                    self.tcanvas.delete(o)
            else:
                if (len(self.wbtnbreakpoints) < tclines):
                    for i in range(self.cbtnbreakpoints, len(self.wbtnbreakpoints)):
                        wc = self.tcanvas.create_window(0, self.btnhei*i, tags=f'{i+1}',  anchor="nw", window=self.wbtnbreakpoints[i][0])
                        self.twindows.append(wc)
                    for i in range(len(self.wbtnbreakpoints), tclines):
                        frame = Frame(self.tcanvas)
                        label = Label(frame, text=f'{i+1}', font=(self.fontstyle, self.lcfs), width=5, foreground='grey')
                        button = BreakPoint(frame, image=self.img_none)
                        button.setlinenoandimg(i+1, self.img_breakpoint, self.activebreakpoints)
                        button.pack(side=RIGHT)
                        label.pack(side=LEFT)
                        self.wbtnbreakpoints.append([frame, label, button])
                        wc = self.tcanvas.create_window(0, self.btnhei*i, tags=f'{i+1}',  anchor="nw", window=self.wbtnbreakpoints[i][0])
                        self.twindows.append(wc)
                else:
                    for i in range(self.cbtnbreakpoints, tclines):
                        wc = self.tcanvas.create_window(0, self.btnhei*i, tags=f'{i+1}',  anchor="nw", window=self.wbtnbreakpoints[i][0])
                        self.twindows.append(wc)
        self.cbtnbreakpoints = tclines
        self.tcanvas.configure(scrollregion=self.tcanvas.bbox("all"))
    
    def getbreakpoints(self):
        return self.activebreakpoints

    #thanks chatgpt!
    def getfontsizeforpixels(self, font_family, target_linespace, start=1, end=80, tolerance=1) -> list[int, int]:
        linespace = 0
        while start < end:
            mid = (start + end) // 2
            f = font.Font(family=font_family, size=mid)
            linespace = f.metrics('linespace')
            if abs(linespace - target_linespace) <= tolerance:
                print(f'fontsize {mid} for {linespace}px')
                return mid, linespace
            elif linespace < target_linespace:
                start = mid + 1
            else:
                end = mid - 1
        print(f'fontsize {start} for {linespace}px')
        return start, linespace

    def moveviewtoline(self, line:int):
        nolines:int = len(self.tlines)
        y_start, y_end = self.twidget.yview()
        y_set:float = line/nolines - (y_end - y_start)*0.15
        #print(y_start, y_set, y_end)
        if not (0 < (line/nolines-y_start) < (y_end-y_start)*0.95):
            if (y_set < 0.0) : y_set = 0.0
            if (y_set > 1.0) : y_set = 1.0
            self.tcanvas.yview("moveto", y_set)
            self.twidget.yview("moveto", y_set)