/**
 * Resource manager
 */

R = {};

R.images = null;

R.sources = [ {
	src : './doudizhu_files/images/startbg.jpg',
	size : 36
}, {
	src : './doudizhu_files/images/mainbg.jpg',
	size : 28
}, {
	src : './doudizhu_files/images/poker.png',
	size : 30
}, {
	src : './doudizhu_files/images/button.png',
	size : 50
}, {
	src : './doudizhu_files/images/portrait.png',
	size : 17
}, {
	src : './doudizhu_files/images/tool.png',
	size : 25
}, {
	src : './doudizhu_files/images/number.png',
	size : 7
}, {
	src : './doudizhu_files/images/result.png',
	size : 26
} ];

R.soundPath = "http://html5lab.sinaapp.com/sounds/";
R.bgSound = [ "normal.mp3", "normal.ogg" ];

R.init = function(images) {
	this.images = images;

	this.startbg = images[0].image;
	this.mainbg = images[1].image;

	//this.logo = new Bitmap(images[2].image, [0, 114, 227, 89]);
	//this.dizhu = new Bitmap(images[2].image, [0, 0, 115, 114]);

	this.button = images[3].image;
	this.bigBtnUp = new Bitmap(this.button, [ 0, 114, 120, 43 ]);
	this.bigBtnDown = new Bitmap(this.button, [ 120, 114, 116, 41 ]);
	this.bigBtnDisabled = new Bitmap(ddz.grayscale(this.button, [ 0, 114, 120,
			43 ]));
	this.orgBtnUp = new Bitmap(this.button, [ 0, 157, 73, 43 ]);
	this.orgBtnDown = new Bitmap(this.button, [ 73, 157, 73, 43 ]);
	this.blueBtnUp = new Bitmap(this.button, [ 0, 71, 73, 43 ]);
	this.blueBtnDown = new Bitmap(this.button, [ 73, 71, 73, 43 ]);
	this.btnDisabled = new Bitmap(ddz.grayscale(this.button, [ 0, 71, 73, 43 ]));

	this.txtSingleGame = new Bitmap(this.button, [ 0, 23, 78, 23 ]);
	this.txtMultiGame = new Bitmap(this.button, [ 78, 48, 78, 23 ]);
	this.txtHelp = new Bitmap(this.button, [ 78, 23, 40, 23 ]);
	this.txtNoGamble = new Bitmap(this.button, [ 88, 0, 46, 23 ]);
	this.txtNoPlay = new Bitmap(this.button, [ 44, 0, 44, 23 ]);
	this.txtStart = new Bitmap(this.button, [ 118, 23, 46, 25 ]);
	this.txtPlay = new Bitmap(this.button, [ 134, 0, 46, 23 ]);
	this.txtTip = new Bitmap(this.button, [ 164, 23, 44, 23 ]);
	this.txtReset = new Bitmap(this.button, [ 156, 48, 44, 23 ]);
	this.txtFen = [ 180, 0, 25, 23 ];
	this.txtOne = [ 0, 0, 8, 19 ];
	this.txtTwo = [ 8, 0, 18, 19 ];
	this.txtThree = [ 26, 0, 18, 19 ];

	this.player = images[4].image;
	this.playerFrame = new Bitmap(this.player, [ 60, 0, 52, 52 ]);
	this.playerGlow = new Bitmap(this.player, [ 0, 0, 60, 60 ]);
	this.playerDefault = new Bitmap(this.player, [ 80, 60, 40, 40 ]);
	this.playerDizhu = new Bitmap(this.player, [ 40, 60, 40, 40 ]);
	this.playerMale = new Bitmap(this.player, [ 0, 60, 40, 40 ]);
	this.playerFemale = new Bitmap(this.player, [ 0, 100, 40, 40 ]);

	this.tool = images[5].image;
	this.toolbar = new Bitmap(this.tool, [ 0, 30, 307, 42 ]);
	this.bubble = new Bitmap(this.tool, [ 307, 30, 84, 48 ]);
	this.txtScore = new Bitmap(this.tool, [ 28, 0, 28, 16 ]);
	this.txtBase = new Bitmap(this.tool, [ 0, 0, 28, 14 ]);
	this.handup = new Bitmap(this.tool, [ 206, 0, 20, 20 ]);
	this.vline = new Bitmap(this.tool, [ 258, 0, 2, 30 ]);
	//this.configIcon = new Bitmap(ddz.grayscale(this.tool, [226, 0, 32, 26]));
	this.configIcon = new Bitmap(this.tool, [ 226, 0, 32, 26 ]);
	this.configBtn = new Button(this.configIcon);
	this.exitIcon = new Bitmap(this.tool, [ 260, 0, 30, 30 ]);
	this.exitIconDown = casual.copy(this.exitIcon, null, {
		alpha : 0.5,
		y : 1
	});
	this.exitBtn = new Button(this.exitIcon, null, this.exitIconDown);
	this.labelExit = new Bitmap(this.tool, [ 56, 0, 75, 20 ]);
	this.labelRestart = new Bitmap(this.tool, [ 131, 0, 75, 20 ]);
	this.popupBg = new Bitmap(this.tool, [ 0, 78, 156, 130 ]);

	this.number = images[6].image;
	this.gold = {};
	this.gold[0] = [ 33, 53, 13, 13 ];
	this.gold[1] = [ 26, 53, 7, 13 ];
	this.gold[2] = [ 13, 53, 13, 13 ];
	this.gold[3] = [ 0, 53, 13, 13 ];
	this.gold[4] = [ 39, 38, 13, 13 ];
	this.gold[5] = [ 26, 38, 13, 13 ];
	this.gold[6] = [ 13, 38, 13, 13 ];
	this.gold[7] = [ 0, 38, 13, 15 ];
	this.gold[8] = [ 39, 24, 13, 13 ];
	this.gold[9] = [ 26, 24, 13, 13 ];
	this.gold["+"] = [ 0, 24, 16, 14 ];
	this.gold["-"] = [ 16, 24, 10, 6 ];
	this.white = {};
	this.white[0] = [ 42, 12, 13, 12 ];
	this.white[1] = [ 35, 12, 7, 12 ];
	this.white[2] = [ 24, 12, 11, 12 ];
	this.white[3] = [ 13, 12, 11, 12 ];
	this.white[4] = [ 0, 12, 13, 12 ];
	this.white[5] = [ 48, 0, 11, 12 ];
	this.white[6] = [ 37, 0, 11, 12 ];
	this.white[7] = [ 24, 0, 13, 12 ];
	this.white[8] = [ 13, 0, 11, 12 ];
	this.white[9] = [ 0, 0, 13, 12 ];

	this.poker = images[2].image;
	this.pokerfg = {
		b : [ 62, 127, 62, 84 ],
		m : [ 76, 58, 44, 62 ],
		s : [ 214, 26, 24, 32 ]
	};
	this.pokerbg = {
		b : [ 0, 127, 62, 84 ],
		m : [ 120, 58, 44, 62 ],
		s : [ 0, 58, 24, 32 ]
	};
	this.pokerWidth = this.pokerfg.b[2];
	this.pokerHeight = this.pokerfg.b[3];

	this.pokerType = {
		heitao : {
			b : {
				r : [ 115, 26, 15, 15 ],
				x : 5,
				y : 22
			},
			m : {
				r : [ 236, 0, 12, 12 ],
				x : 4,
				y : 18
			},
			s : {
				r : [ 236, 0, 12, 12 ],
				x : 6,
				y : 16
			}
		},
		hongtao : {
			b : {
				r : [ 145, 26, 15, 15 ],
				x : 5,
				y : 22
			},
			m : {
				r : [ 24, 12, 12, 12 ],
				x : 4,
				y : 18
			},
			s : {
				r : [ 24, 12, 12, 12 ],
				x : 6,
				y : 17
			}
		},
		meihua : {
			b : {
				r : [ 130, 26, 15, 15 ],
				x : 5,
				y : 22
			},
			m : {
				r : [ 0, 12, 12, 12 ],
				x : 4,
				y : 18
			},
			s : {
				r : [ 0, 12, 12, 12 ],
				x : 6,
				y : 16
			}
		},
		fangkuai : {
			b : {
				r : [ 100, 26, 15, 15 ],
				x : 4,
				y : 22
			},
			m : {
				r : [ 12, 12, 12, 12 ],
				x : 4,
				y : 18
			},
			s : {
				r : [ 12, 12, 12, 12 ],
				x : 6,
				y : 16
			}
		},
		jokera : {
			b : {
				r : [ 193, 58, 29, 66 ],
				x : 20,
				y : 8
			},
			m : {
				r : [ 24, 58, 19, 43 ],
				x : 16,
				y : 9
			},
			s : {
				r : [ 203, 26, 11, 25 ],
				x : 10,
				y : 3
			}
		},
		jokerb : {
			b : {
				r : [ 164, 58, 29, 66 ],
				x : 20,
				y : 8
			},
			m : {
				r : [ 43, 58, 19, 43 ],
				x : 16,
				y : 9
			},
			s : {
				r : [ 188, 26, 11, 25 ],
				x : 10,
				y : 3
			}
		}
	};

	this.pokerPoint = {
		3 : {
			b : {
				r : [ 138, 12, 10, 14 ],
				b : [ 30, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 96, 0, 8, 11 ],
				b : [ 210, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 96, 0, 8, 11 ],
				b : [ 210, 0, 8, 11 ],
				x : 8,
				y : 3
			}
		},
		4 : {
			b : {
				r : [ 128, 12, 10, 14 ],
				b : [ 80, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 0, 0, 8, 11 ],
				b : [ 202, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 0, 0, 8, 11 ],
				b : [ 202, 0, 8, 11 ],
				x : 7,
				y : 3
			}
		},
		5 : {
			b : {
				r : [ 50, 26, 10, 14 ],
				b : [ 90, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 80, 0, 8, 11 ],
				b : [ 24, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 80, 0, 8, 11 ],
				b : [ 24, 0, 8, 11 ],
				x : 8,
				y : 3
			}
		},
		6 : {
			b : {
				r : [ 216, 12, 10, 14 ],
				b : [ 70, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 64, 0, 8, 11 ],
				b : [ 32, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 64, 0, 8, 11 ],
				b : [ 32, 0, 8, 11 ],
				x : 8,
				y : 3
			}
		},
		7 : {
			b : {
				r : [ 180, 12, 10, 14 ],
				b : [ 40, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 72, 0, 8, 11 ],
				b : [ 40, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 72, 0, 8, 11 ],
				b : [ 40, 0, 8, 11 ],
				x : 8,
				y : 3
			}
		},
		8 : {
			b : {
				r : [ 0, 26, 10, 14 ],
				b : [ 20, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 88, 0, 8, 11 ],
				b : [ 104, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 88, 0, 8, 11 ],
				b : [ 104, 0, 8, 11 ],
				x : 8,
				y : 3
			}
		},
		9 : {
			b : {
				r : [ 148, 12, 10, 14 ],
				b : [ 10, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 48, 0, 8, 11 ],
				b : [ 174, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 48, 0, 8, 11 ],
				b : [ 174, 0, 8, 11 ],
				x : 8,
				y : 3
			}
		},
		10 : {
			b : {
				r : [ 158, 12, 16, 14 ],
				b : [ 190, 12, 16, 14 ],
				x : 4,
				y : 5
			},
			m : {
				r : [ 190, 0, 12, 11 ],
				b : [ 146, 0, 12, 11 ],
				x : 4,
				y : 4
			},
			s : {
				r : [ 190, 0, 12, 11 ],
				b : [ 146, 0, 12, 11 ],
				x : 6,
				y : 3
			}
		},
		11 : {
			b : {
				r : [ 226, 12, 8, 14 ],
				b : [ 234, 12, 8, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 56, 0, 8, 11 ],
				b : [ 122, 0, 8, 11 ],
				x : 5,
				y : 4
			},
			s : {
				r : [ 56, 0, 8, 11 ],
				b : [ 122, 0, 8, 11 ],
				x : 7,
				y : 3
			}
		},
		12 : {
			b : {
				r : [ 160, 26, 12, 16 ],
				b : [ 172, 26, 12, 16 ],
				x : 7,
				y : 4
			},
			m : {
				r : [ 36, 12, 10, 13 ],
				b : [ 46, 12, 10, 13 ],
				x : 5,
				y : 3
			},
			s : {
				r : [ 36, 12, 10, 13 ],
				b : [ 46, 12, 10, 13 ],
				x : 7,
				y : 2
			}
		},
		13 : {
			b : {
				r : [ 56, 12, 12, 14 ],
				b : [ 68, 12, 12, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 136, 0, 10, 11 ],
				b : [ 112, 0, 10, 11 ],
				x : 4,
				y : 4
			},
			s : {
				r : [ 136, 0, 10, 11 ],
				b : [ 112, 0, 10, 11 ],
				x : 7,
				y : 3
			}
		},
		14 : {
			b : {
				r : [ 80, 12, 14, 14 ],
				b : [ 104, 12, 14, 14 ],
				x : 5,
				y : 5
			},
			m : {
				r : [ 158, 0, 10, 11 ],
				b : [ 218, 0, 10, 11 ],
				x : 5,
				y : 4
			},
			s : {
				r : [ 158, 0, 10, 11 ],
				b : [ 218, 0, 10, 11 ],
				x : 7,
				y : 3
			}
		},
		15 : {
			b : {
				r : [ 118, 12, 10, 14 ],
				b : [ 60, 26, 10, 14 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 182, 0, 8, 11 ],
				b : [ 228, 0, 8, 11 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 182, 0, 8, 11 ],
				b : [ 228, 0, 8, 11 ],
				x : 8,
				y : 3
			}
		},
		16 : {
			b : {
				r : [ 233, 58, 11, 69 ],
				b : [ 233, 58, 11, 69 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 69, 58, 7, 48 ],
				b : [ 69, 58, 7, 48 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 199, 26, 4, 25 ],
				b : [ 199, 26, 4, 25 ],
				x : 5,
				y : 3
			}
		},
		17 : {
			b : {
				r : [ 222, 58, 11, 69 ],
				b : [ 222, 58, 11, 69 ],
				x : 7,
				y : 5
			},
			m : {
				r : [ 62, 58, 7, 48 ],
				b : [ 62, 58, 7, 48 ],
				x : 6,
				y : 4
			},
			s : {
				r : [ 184, 26, 4, 25 ],
				b : [ 184, 26, 4, 25 ],
				x : 5,
				y : 3
			}
		}
	};

	this.result = images[7].image;
	this.dizhuWin = new GroupBitmap(this.result);
	this.dizhuWin.addSlice( [ 0, 62, 129, 60 ], 0, 0);
	this.dizhuWin.addSlice( [ 129, 62, 65, 60 ], 130, 0);
	this.dizhuWin.width = 195;
	this.dizhuWin.height = 62;
	this.poolWin = new GroupBitmap(this.result);
	this.poolWin.addSlice( [ 0, 0, 129, 62 ], 0, 0);
	this.poolWin.addSlice( [ 129, 62, 65, 60 ], 130, 0);
	this.poolWin.width = 195;
	this.poolWin.height = 62;
}
