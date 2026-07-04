Config = {}

Config.Framework = "auto" -- auto, qbx, qbcore, esx
Config.Debug = false

Config.ServerName = "PLACEHOLDER"
Config.UseServerLogo = true
Config.ServerLogo = "images/server_logo.png"

Config.OpenKey = "HOME"
Config.FocusToggleKey = "TAB"
Config.UpdateInterval = 5000

Config.ShowPlayerList = true
Config.PlayerListAdminOnly = true
Config.ShowStaffCount = true

Config.StaffGroups = {
	"admin",
	"superadmin",
	"god",
}

Config.OverheadIds = {
	enabled = true,
	maxDistance = 50.0,
	showSelf = true,
	prefix = "",
}

Config.PillColors = {
	blue = "#3B82F6",
	red = "#EF4444",
	orange = "#F97316",
	green = "#22C55E",
	yellow = "#EAB308",
	gray = "#9CA3AF",
	staff = "#FACC15",
}

Config.ShowHeists = true
Config.RobberyPoliceGroup = "law_enforcement"

Config.Robberies = {
	store = {
		label = "Store Robbery",
		icon = "store",
		requiredPolice = 1,
		show = true,
	},
	car = {
		label = "Car Theft",
		icon = "car-front",
		requiredPolice = 1,
		show = true,
	},
	drugs = {
		label = "Drug Lab",
		icon = "flask",
		requiredPolice = 2,
		show = true,
	},
	house = {
		label = "House Robbery",
		icon = "home",
		requiredPolice = 2,
		show = true,
	},
	jewelry = {
		label = "Jewelry Store",
		icon = "gem",
		requiredPolice = 3,
		show = true,
	},
	bank = {
		label = "Bank Heist",
		icon = "landmark",
		requiredPolice = 4,
		show = true,
	},
}

Config.JobSections = {
	law_enforcement = {
		label = "Law Enforcement",
		shortLabel = "Police",
		icon = "shield",
		color = "blue",
		order = 1,
		show = true,
		standalone = false,
		businesses = {
			police = {
				label = "Los Santos Police Department",
				icon = "shield",
				jobs = { "police", "sheriff", "bcso", "sasp", "fib" },
				order = 1,
				show = true,
				ondutyOnly = true,
			},
			bcso = {
				label = "Blaine's County Sheriff's Office",
				icon = "shield",
				jobs = { "bcso" },
				order = 2,
				show = true,
				ondutyOnly = true,
			},
			sasp = {
				label = "San Andreas State Police",
				icon = "shield",
				jobs = { "sasp" },
				order = 3,
				show = true,
				ondutyOnly = true,
			},
		},
	},
	medical = {
		label = "Medical Services",
		shortLabel = "Medics",
		icon = "heart-pulse",
		color = "red",
		order = 2,
		show = true,
		standalone = true,
		businesses = {
			ems = {
				label = "EMS",
				icon = "heart-pulse",
				jobs = { "ambulance", "ems", "doctor" },
				order = 1,
				show = true,
				ondutyOnly = true,
			},
		},
	},
	restaurants = {
		label = "Restaurants",
		shortLabel = "Restaurants",
		icon = "utensils",
		color = "orange",
		order = 3,
		show = true,
		standalone = false,
		businesses = {
			burgershot = {
				label = "Burger Shot",
				icon = "utensils",
				jobs = { "burgershot" },
				order = 1,
				show = true,
				ondutyOnly = false,
			},
			pearl = {
				label = "Pearls Seafood",
				icon = "utensils",
				jobs = { "pearl", "pearls" },
				order = 2,
				show = true,
				ondutyOnly = false,
			},
			pizza = {
				label = "Pizza This",
				icon = "utensils",
				jobs = { "pizza", "pizzathis" },
				order = 3,
				show = true,
				ondutyOnly = false,
			},
		},
	},
	civilian = {
		label = "Unemployed",
		shortLabel = "Unemployed",
		icon = "users",
		color = "gray",
		order = 99,
		show = true,
		standalone = true,
		businesses = {
			unemployed = {
				label = "Unemployed",
				icon = "users",
				jobs = { "unemployed" },
				order = 1,
				show = true,
				ondutyOnly = false,
			},
		},
	},
}
