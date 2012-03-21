/**
 * Module to work with note list
 * view all, selecting, checking, appending, filtering
 */
var NoteList = new function () {
	// for limited scopes
	var self = this;

	// component state flag
	// true  - everything is decoded
	// false - no plain data, everything is encrypted
	this.open = true;

	var hint_tag_include = 'click on this tag to include it to the search';
	var hint_tag_exclude = 'click on this tag to exclude it from the search';
	var hint_tag_missing = 'there are no tags specified for this note';

	/**
	 * Open the subscriber
	 * master password is accessible
	 * decrypt all the data and show it
	 */
	this.EventOpen = function () {
		fb('EventOpen: NoteList');
		elclear(self.dom.notes);
		// fill notes
		self.BuildTable(false);
		// component state flag
		this.open = true;
	};

	/**
	 * Close the subscriber
	 * master password is expired and cleared
	 * clear all the decrypted data
	 */
	this.EventClose = function () {
		fb('EventClose: NoteList');
		// close only if opened at the moment
		if ( this.open ) {
			// clear notes
			elclear(self.dom.notes);
			// component state flag
			this.open = false;
		}
	};


	var SetNoteIcon = function ( note ) {
//		var icon = 'img/tag_note.png',
//			tags = TagManager.IDs2Names(note.data.tags);
//		// check parsed string
//		if ( tags && tags instanceof Array ) {
//			// iterate words in the input string
//			for ( var i = 0; i < tags.length; i++ ) {
//				if ( icon_tags.indexOf(tags[i]) >= 0 ) {
//					icon = 'img/tag_' + tags[i] + '.png';
//					break;
//				}
//			}
//		}
		var entries = note.data.entries;
		//fb(note);
		for ( var j in entries ) {
			if ( entries[j].id_type == 2 ) {
				var url = App.Decode(entries[j].data);
				if ( url.search('http://') >= 0 || url.search('https://') >= 0 ) {
					url = url.replace('http://', '');
					url = url.replace('https://', '');
					url = url.split('/');
					if ( url[0] ) {
						icon = 'http://www.getfavicon.org/?url='+url[0]+'/favicon.32.png';
						break;
					}
				}
			}
		}

		note.dom.icon.src = icon;
	};

//	this.NoteVisible = function ( note ) {
//		// flag to show this note or not
//		var flag = true;
////		for ( var i = 0; i < this.data.filter.tinc.length; i++ ) {
////			if ( !note.data.tags.has(this.data.filter.tinc[i]) ) {flag = false;break;}
////		}
////		if ( flag ) {
////			for ( i = 0; i < this.data.filter.texc.length; i++ ) {
////				if ( note.data.tags.has(this.data.filter.texc[i]) ) {flag = false;break;}
////			}
////		}
//		if ( flag ) {
//			$(note).removeClass('hidden');
//		} else {
//			$(note).addClass('hidden');
//		}
//		return flag;
//	};

//	this.DrawNoteTags = function ( note ) {
//		//elclear(note.dom.tags.exc);
//		elclear(note.dom.tags.inc);
//		elclear(note.dom.tags.set);
//
//		var names = [];
//		note.data.tags.each(function(item){
////			if ( !self.data.filter.tinc.has(item) ) {
////				names.push(data_tags_idlist[item]);
////			}
//		});
//		names.sort().each(function(item){
//			elchild(note.dom.tags.set, element('span',
//				{className:'tag', title:'click on this tag to include it to the search', tagid:data_tags_nmlist[item]},
//				item, {onclick:TagInclude}));
//		});
//
////		self.data.filter.tinc.each(function(item){
////			if ( item ) {
////				elchild(note.dom.tags.inc, element('span',
////					{className:'tag include', title:"click on this tag to exclude it from the filtering", tagid:item},
////					data_tags_idlist[item], {onclick:TagExclude}));
////			}
////		});
//	};

//	var NoteActive = function ( note ) {
//		if ( self.dom.notes.active ) $(self.dom.notes.active).removeClass('active');
//		$(note).addClass('active');
//		self.dom.notes.active = note;
//	};

	var NoteDelete = function ( data ) {
		$.post('/note/delete', {ids:[data.id]}, function(data){
			if ( !data.error ) {
				fb(data);
			} else {
				self.InfoSet('The request was not successful this time. The response from the server: ' + data.error, 'error');
			}
		});
	};

	var NoteBody = function ( data ) {
		var result = [element('div', {className:'bold'}, 'id:' + data.id)];
		for ( var i = 0; i < data.entries.length; i++ ) {
			var entry = data.entries[i];
			if ( entry.id_type != 4 ) {
				var text = App.Decode(entry.data);
				if ( text ) {
					text = text.slice(0, 100);
					if ( entry.id_type == 6 ) {
						result.push(element('div', {className:'entry'}, [
							element('span', {className:'name'}, App.Decode(entry.name) + ': '),
							element('span', {className:'data bold'}, text)
						]));
					} else {
						result.push(element('span', {className:'entry'}, [
							element('span', {className:'name'}, App.Decode(entry.name) + ': '),
							element('span', {className:'data bold'}, text)
						]));
					}
				}
			}
		}
		return result;
	};

//	var NotePrepare = function ( data ) {
//		var tbl  = element('table', {});
//		var icon = element('img', {width:32, height:32, className:'hidden'}, null, {onload:function(){/*$(this).fadeIn();*/$(this).removeClass('hidden');}});
//		var hint = element('div', {className:'hint'}, [TimestampToDateStr(data.mtime), ' ', element('a', {data:data}, 'delete', {onclick:function(e){
//			if (!e ) e = window.event;e.cancelBubble = true;
//			if ( e.stopPropagation ) e.stopPropagation();
//			NoteDelete(this.data);
//		}})]);
//		var tags = element('div', {className:'tags'});
//		//var note = element('div', {className:'note', data:data}, [hint, tbl, tags], {onclick:function(){
//		var note = element('div', {className:'note', data:data}, tags, {onclick:function(){
//			NoteActive(this);
//			NoteEditor.Load(this.data);
//			$('#ui-layout-east-tplist').hide();
//			$('#ui-layout-east-data').show();
//		}});
//		note.dom = {icon:icon, hint:hint, tags:tags};
//		tags.exc = element('span', {className:'exc'});
//		tags.inc = element('span', {className:'inc'});
//		tags.set = element('span', {className:'set'});
//		//tblrow(tbl, [icon, NoteBody(data)], [{className:'icon'}, {className:'body'}]);
//		elchild(note.dom.tags, [tags.exc, tags.inc, tags.set]);
//		SetNoteIcon(note);
//		self.DrawNoteTags(note);
//		return note;
//	};

	/**
	 * Tag button click handle
	 * include, exclude and subtract
	 */
	var TagClickHandle = function ( event ) {
		// prevent bubbling
		event.stopPropagation();
		// ctrl holding
		if ( event.ctrlKey ) {
			NoteFilter.TagSubtract(this.tagnm);
		} else {
			if ( this.finc ) {
				// available for selection
				NoteFilter.TagInclude(this.tagnm);
			} else {
				// already selected
				NoteFilter.TagExclude(this.tagnm);
			}
		}
	};

	var BuildNoteBody = function ( data ) {

	}

	/**
	 * Makes a list of note tags buttons with handlers
	 * @param note array note attributes
	 * @return array of html tags
	 */
	var BuildNoteTags = function ( note ) {
		var list = [], exc = [], inc = [];
		// there is some data
		if ( note.tags.length > 0 ) {
			// separate tags
			note.tags.each(function(item){
				if ( !NoteFilter.data.tinc.has(item) ) exc.push(data_tags_idlist[item]); else inc.push(data_tags_idlist[item]);
			});
			// forms the list of tags already selected
			inc.sort().each(function(item){
				// create html wrapper for tag
				item = element('span', {className:'tag include', tagnm:item, title:hint_tag_exclude}, item);
				// mouse click handler
				$(item).bind('click', TagClickHandle);
				list.push(item);
			});
			// forms the list of tags available for selection
			exc.sort().each(function(item){
				// create html wrapper for tag
				item = element('span', {className:'tag', finc:true, tagnm:item, title:hint_tag_include}, item);
				// mouse click handler
				$(item).bind('click', TagClickHandle);
				list.push(item);
			});
		}
		// list of tags or missing hint
		return list.length > 0 ? list : hint_tag_missing;
	}

	/**
	 * Returns the corresponding note icon image address
	 * @param note array note attributes
	 */
	var GetNoteIcon = function ( note ) {
		// prepare
		var icon = 'img/tag_note.png',
			tags = TagManager.IDs2Names(note.tags);
		// iterate words in the tag list
		tags.each(function(item){
			// it's a tag from the global set
			if ( icon_tags.has(item) ) {
				// get the first match
				icon = 'img/tag_' + item + '.png';return;
			}
		});
		return icon;
	}

	var ShowCtrlPanel = function () {
		var i, item;
		for ( i = 0; i < self.dom.notes.childNodes.length; i++ ) {
			item = self.dom.notes.childNodes[i];
			if ( item.state.checked ) {
				self.dom.tpctrl.style.display = 'table-cell';
				return;
			}
		}
		self.dom.tpctrl.style.display = 'none';
	}

	/**
	 * Set the default note state, removes additional classes and resets the state flags
	 * @param note if given than it's the only note to be reset
	 */
	var NoteStateClear = function ( note ) {
		// all notes or only the given one
		var i, list = note ? [note] : self.dom.notes.childNodes;
		// iterate formed list
		for ( i = 0; i < list.length; i++ ) {
			// reset class and state flags
			list[i].className    = 'note';
			list[i].state.active  = false;
			list[i].state.edited  = false;
			list[i].state.checked = false;
		}
	}

	/**
	 * Sets the flag and clall to the given note
	 * @param note to be processed
	 * @param type string name active | edited | checked
	 * @param state optional bool flag, if set true - set, false - unset
	 */
	this.NoteStateSet = function ( note, type, state ) {
		// check input
		if ( note ) {
			// determine the state to switch to
			note.state[type] = state || (note.state[type] ? false : true);
			// invert class
			$(note).toggleClass(type, note.state[type]);
		}
	}

	/**
	 * Highlights the active note or note range
	 * range means to select all the notes between old and new selected notes
	 * @param note to be processed
	 * @param range flag to process the range
	 */
	var NoteStateActive = function ( note, range ) {
		// reset all notes states
		NoteStateClear();
		// flag true if the node is the same as already active
		var fsame = false;
		// last active note
		var alast = null;
		// there is already active note
		if ( self.dom.notes.active ) {
			// it's the save as already active
			fsame = ( self.dom.notes.active.data.id === note.data.id );
			if ( !fsame ) {
				// another note
				alast = self.dom.notes.active;
				$(self.dom.notes.active).removeClass('active');
				self.dom.notes.active.state.active = false;
			}
		}
		// not the same as already active
		if ( !fsame ) {
			// update attributes
			self.dom.notes.active = note;
			$(note).addClass('active');
			note.state.active = true;
			// check if the edited note is not already active
			if ( NoteEditor.GetNoteID() !== note.data.id ) {
				// show note details
				NoteEditor.Load(note.data);
				$('#ui-layout-east-tplist').hide();
				$('#ui-layout-east-data').show();
			}
		}
		// holding Shift key
		if ( range ) {
			var i, item, cflag = false;
			// iterate all notes
			for ( i = 0; i < self.dom.notes.childNodes.length; i++ ) {
				// cursor
				item = self.dom.notes.childNodes[i];
				// flag showing that the cursor is inside the range
				if ( item.data.id === alast.data.id || item.data.id === note.data.id ) cflag = !cflag;
				// check inside the range or edge items
				if ( cflag || item.data.id === alast.data.id || item.data.id === note.data.id ) {
					self.NoteStateSet(item, 'checked');
				}
			}
		} else {
			self.NoteStateSet(note, 'checked');
		}
	}

	/**
	 * Whole note ckick handler
	 */
	var NoteClickHandler = function ( event ) {
		//fb(event);
		if ( event.ctrlKey ) {
			self.NoteStateSet(this, 'checked');
		} else {
			NoteStateActive(this, event.shiftKey);
		}
		ShowCtrlPanel();
	}

	/**
	 * Note checkbox ckick handler
	 */
	var NoteTickClickHandler = function ( event ) {
		event.stopPropagation();
		self.NoteStateSet(this.note, 'checked');
		ShowCtrlPanel();
	}

	/**
	 * Return the html note block by id if found or false otherwise
	 * @param id int note attribute
	 */
	this.GetNoteByID = function ( id ) {
		// iterate note list
		for ( var i = 0, list = this.dom.notes.childNodes; i < list.length; i++ ) {
			// return if matched
			if ( list[i].data.id === id ) return list[i];
		}
		return false;
	}

	/**
	 * Forms the note wrapper
	 * @param data array of note parameters
	 */
	this.BuildNote = function ( data ) {
		// note body
		var note = element('div', {className:'note', data:data, dom:{}, state:{}});
		// note content
		elchild(note, [
			element('div', {className:'icon'}, [
				note.dom.icon = element('img', {className:'icon', src:GetNoteIcon(data)}),
				note.dom.tick = element('div', {className:'tick', note:note})
			]),
			element('div', {className:'body'}, [
				note.dom.info = element('div', {className:'info'}, data.id),
				note.dom.time = element('div', {className:'time'}, TimestampToDateStr(data.mtime)),
				note.dom.tags = element('div', {className:'tags'}, BuildNoteTags(data))
			])
		]);
		// whole note ckick
		$(note).bind('click', NoteClickHandler);
		// checkbox click
		$(note.dom.tick).bind('click', NoteTickClickHandler);
		// note html body
		return note;
	}

	this.NoteCreate = function ( data ) {
		// update latest and current note lists
		data_notes_latest.splice(0,0,data);
		//this.data.notes.splice(0,0,data);
		// build note and add it activated to the list top
		var note = this.dom.notes.insertBefore(this.BuildNote(data), this.dom.notes.childNodes[0]);
		NoteStateActive(note);
		// need to show controls for top note
		ShowCtrlPanel();
	};

	this.NoteUpdate = function ( data ) {
		// get the updating note
		var note = this.GetNoteByID(data.id);
		// remove current active note if exist
		if ( note ) {
			// icon
			note.dom.icon.src = GetNoteIcon(data);
			// tags
			elchild(elclear(note.dom.tags), BuildNoteTags(data));
			// time
			elchild(elclear(note.dom.time), TimestampToDateStr(data.mtime));
			// move to the top
			this.dom.notes.insertBefore(note, this.dom.notes.childNodes[0]);

			//this.dom.notes.removeChild(note);
			// build note and add it activated to the list top
			//note = this.dom.notes.insertBefore(this.BuildNote(data), this.dom.notes.childNodes[0]);
		} else {
			note = this.NoteCreate(data);
		}

		//if ( NoteVisibility(note) ) {}
		//NoteStateActive(note);
		//this.dom.notes.active = null;
		// need to show controls for top note
		ShowCtrlPanel();
	}

	var NoteVisibility = function ( note ) {
		// flag to show this note or not
		var flag = true;
		if ( NoteFilter.data.tinc.length > 0 || NoteFilter.data.texc.length > 0 ) {
			note.data.tags.each(function(item){
				fb(item, !NoteFilter.data.tinc.has(item), NoteFilter.data.texc.has(item));
				if ( !NoteFilter.data.tinc.has(item) || NoteFilter.data.texc.has(item) ) {
					flag = false;
					return;
				}
			});
		}

//		for ( var i = 0; i < this.data.filter.tinc.length; i++ ) {
//			if ( !note.data.tags.has(this.data.filter.tinc[i]) ) {flag = false;break;}
//		}
//		if ( flag ) {
//			for ( i = 0; i < this.data.filter.texc.length; i++ ) {
//				if ( note.data.tags.has(this.data.filter.texc[i]) ) {flag = false;break;}
//			}
//		}
		$(note).toggleClass('hidden', !flag);
		fb(flag);
		return flag;
	};

	/**
	 * Fills the note list with generated notes
	 * @param data array of notes or false if gloabal latest list should be used
	 */
	this.BuildTable = function ( data ) {
		// check input and determine mode - last or requested
		data = data instanceof Array ? (this.data.notes = data) : (data === false ? data_notes_latest : this.data.notes);
		// clearing the container
		elclear(self.dom.notes);
		// clear current active note
		delete self.dom.notes.active;
		// there are some notes
		if ( data.length > 0 ) {
			// determine the note id beeing edited at the moment
			var note, neid = NoteEditor.GetNoteID();
			// iterate all notes
			data.each(function(item){
				// append the created note to the list
				note = self.BuildNote(item);
				elchild(self.dom.notes, note);
				// highlight the edited at the moment note
				if ( neid === item.id ) self.NoteStateSet(note, 'edited');
			});
		}
	};

	this.Filter = function ( text ) {
		text = text.toLowerCase();
		for ( var i = 0; i < self.dom.notes.childNodes.length; i++ ) {
			// prepare
			var item = self.dom.notes.childNodes[i];
			// search substring and show/hide
			$(item).toggle(item.raw.indexOf(text) >= 0);
		}
	};

//	var SetFilterTags = function ( data ) {
//		data = data || self.dom.search.input.value;
//		self.data.filter = TagManager.ParseStr(data);
//	};



	var BuildSearchStr = function () {
		var words = [];
		// prepare all words for concatenation
		//self.data.filter.texc.each(function(item){if ( item ) words.push('-'+data_tags_idlist[item]);});
		//self.data.filter.tinc.each(function(item){if ( item ) words.push(    data_tags_idlist[item]);});
		// replace the search string by the reformatted one
		self.dom.search.input.value = words.join(' ');
	};

//	var TagExclude = function ( e ) {
//		if (!e ) e = window.event;e.cancelBubble = true;
//		if ( e.stopPropagation ) e.stopPropagation();
//
//		NoteFilter.TagExclude(this.tagnm);
//		//var texc  = self.data.filter.texc,
//		//	tinc  = self.data.filter.tinc;
//		// locate
////		var iexc = texc.indexOf(this.tagid);
////		var iinc = tinc.indexOf(this.tagid);
////		// and clear
////		if ( iexc >= 0 ) texc.splice(iexc, 1);
////		if ( iinc >= 0 ) tinc.splice(iinc, 1);
////		// remove current tag
////		this.parentNode.removeChild(this);
////		BuildSearchStr();
////		// send request
////		Filter();
//	};

	var FilterTags = function () {
		elclear(self.dom.tags.exc);
		elclear(self.dom.tags.inc);

//		if ( !self.data.filter.texc.empty() || !self.data.filter.tinc.empty() ) {
//			self.dom.tags.style.display = 'block';
//
//			self.data.filter.texc.each(function(item){
//				if ( item ) {
//					elchild(self.dom.tags.exc, element('span',
//						{className:'tag exclude', title:'click on this tag to exclude it from the filtering', tagid:item},
//						data_tags_idlist[item], {onclick:TagExclude}));
//				}
//			});
//		} else {
//			self.dom.tags.style.display = 'none';
//		}
	};

	/**
	 * Main init method
	 * @param params list of configuration parameters
	 */
	this.Init = function ( params ) {
		// check input
		if ( !params.handle ) return;
		// html parent object
		this.dom = {handle:params.handle};

		this.data = {
			latest :true, // show only the last 20 notes
			notes  :[]   // all requested notes data array
			//checked:[]    // list of checked notes id
			//filter :TagManager.ParseStr()
		};

		// build all blocks together
		elchild(this.dom.handle, [
			//this.dom.search = element('div', {className:'search'}),
			//this.dom.tags   = element('div', {className:'tags hidden'}),
			//this.dom.info   = element('div', {className:'info'}),
			//this.dom.help   = element('div', {className:'help hidden'}),
			this.dom.tpbar = element('div', {className:'tpbar'}, [
				this.dom.tpinfo = element('div', {className:'info'}, 'info'),
				this.dom.tpctrl = element('div', {className:'ctrl'}, 'control panel')
			]),
			this.dom.notes = element('div', {className:'notes', active:null}),
			this.dom.btbar = element('div', {className:'btbar'})
		]);

		this.dom.notes.onselectstart = function () {return false;} // ie
		this.dom.notes.onmousedown   = function () {return false;} // mozilla

//		elchild(this.dom.search, [
//			this.dom.search.icon    = element('img', {className:'icon', src:'img/search.png'}),
//			this.dom.search.input   = element('input', {type:'text', className:'line'}),
//			this.dom.search.suggest = element('div', {className:'suggest'}),
//			this.dom.search.control = element('div', {className:'control'}, [element('span', {}, 'clear', {onclick:function(){
//				self.dom.search.input.value = '';
//				self.dom.search.input.focus();
//			}})])
//		]);

//		elchild(this.dom.tags, [
//			this.dom.tags.title = element('span', {className:'title'}, 'tags'),
//			this.dom.tags.exc   = element('span', {className:'exc'}),
//			this.dom.tags.inc   = element('span', {className:'inc'}),
//			this.dom.tags.hint  = element('span', {className:'hint'}, 'click on a tag to exclude it from the search')
//		]);
	};
};