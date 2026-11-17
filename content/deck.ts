// All copy for the pitch deck lives here. Built from the owner's list in
// docs/service-ideas-2026-11-11.md — every service keeps the owner's idea and
// adds what it watches, an example alert, who buys it and why it pays.
// Alerts are examples, not measured results. No customers, prices or traction
// are claimed anywhere.

export type Sense = "camera" | "thermal" | "vibration" | "sensor";

export type GroupId = "rounds" | "people" | "theft" | "water" | "buildings" | "production" | "farms";

export type Service = {
  id: string;
  group: GroupId;
  /** card / list title */
  name: string;
  /** two-or-three-word label for the index */
  short: string;
  /** what it does, one sentence */
  line: string;
  /** what the camera or sensor looks at */
  watches: string;
  /** an example trigger (shown as "Alert when …") */
  alert: string;
  /** what happens next (optional) */
  then?: string;
  buyers: string;
  value: string;
  senses: Sense[];
  /** can be added later for a better result; the service starts without it */
  options?: Sense[];
  /** photo slug in content/photos.ts */
  photo: string;
  /** honest boundary, shown small */
  note?: string;
  /** featured service */
  flagship?: boolean;
  /** the example alert card on the photo */
  card: { meta: string; title: string };
};

export type Group = {
  id: GroupId;
  name: string;
  title: string;
  line: string;
  tone: "paper" | "dark";
};

export const GROUPS: Group[] = [
  {
    id: "rounds",
    name: "Rounds & readings",
    title: "Three ways to upgrade without replacing anything.",
    line: "A camera on what's already there reads it, checks it and documents it, around the clock.",
    tone: "paper",
  },
  {
    id: "people",
    name: "Safety & HSE",
    title: "Safety rules, checked every minute.",
    line: "Cameras around the workplace check that the rules are followed and catch the moment someone is at risk.",
    tone: "dark",
  },
  {
    id: "theft",
    name: "Theft & break-ins",
    title: "Theft, caught while it happens.",
    line: "Copper, tools, machines and goods: the things that disappear when nobody is looking.",
    tone: "paper",
  },
  {
    id: "water",
    name: "Water & weather",
    title: "Water where it shouldn't be.",
    line: "Basements, stations, garages and roofs, watched between visits.",
    tone: "dark",
  },
  {
    id: "buildings",
    name: "Buildings & self-service",
    title: "Places that run without staff.",
    line: "Apartment buildings, laundries, shops and kitchens: the everyday problems someone usually finds too late.",
    tone: "paper",
  },
  {
    id: "production",
    name: "Production & logistics",
    title: "Downtime, seen the minute it starts.",
    line: "Lines, docks, robots and machines: every minute standing still costs money.",
    tone: "dark",
  },
  {
    id: "farms",
    name: "Farms & animals",
    title: "Animals, watched through the night.",
    line: "Inside the barn, at the fence and out on the pasture.",
    tone: "paper",
  },
];

export const SERVICES: Service[] = [
  // ── 01 Rounds & readings ────────────────────────────────────────────────
  {
    id: "old-equipment",
    group: "rounds",
    name: "Old equipment, online",
    short: "Old panels online",
    line: "A camera in front of an old panel reads its dials, displays and lamps the way an operator would, and turns them into live data and alerts.",
    watches: "Analog gauges, meters, counters, displays and warning lamps on boilers, pumps, tanks and panels that were never connected.",
    alert: "pressure on gauge P-3 stays above 6 bar for 5 minutes",
    then: "Readings flow into a dashboard or your existing systems; alerts go to whoever is on call.",
    buyers: "Housing co-ops and property owners with an old boiler room, dairies, bakeries, small factories, waterworks and utilities.",
    value: "Digitized at about 1/25 of the price of replacing the system. No rewiring, no shutdown.",
    senses: ["camera"],
    photo: "legacy-panels",
    flagship: true,
    card: { meta: "Gauge P-3 · read every minute", title: "6.4 bar, above limit for 5 min" },
  },
  {
    id: "control-rounds",
    group: "rounds",
    name: "Digital rounds",
    short: "Digital rounds",
    line: "The daily walk-round of gauges, drips, doors and lamps, done by camera every few minutes and logged.",
    watches: "Every checkpoint on today's paper round: levels, drips, open doors, warning lamps.",
    alert: "a checkpoint deviates from normal, so staff only walk when something is actually wrong",
    buyers: "Anyone who still walks a round: plant rooms in apartment buildings and schools, cold stores, district heating, water treatment, hospitals.",
    value: "A round every few minutes instead of once a shift, with a log that proves each one.",
    senses: ["camera", "sensor"],
    options: ["thermal"],
    photo: "plant-room",
    card: { meta: "Round 14:05 · 22 of 22 checkpoints", title: "Checkpoint 9: drip under valve V-12" },
  },
  {
    id: "inspection-proof",
    group: "rounds",
    name: "Proof of routines",
    short: "Proof of routines",
    line: "Confirms and logs that a routine really happened: the closing check, the fire round, the cleaning, the mandatory inspection.",
    watches: "The checkpoint and its steps: doors locked and lights off at closing, fire doors checked, a container seal or lashing inspected.",
    alert: "a routine is missed, cut short or done without its required steps",
    then: "Every check gets a timestamped record, ready for the auditor or the insurer.",
    buyers: "Shops, restaurants, warehouses, ports and terminals: anyone with mandatory checks for fire safety, food safety, lifting gear or cargo.",
    value: "Proof without paperwork. Nothing is skipped without anyone knowing.",
    senses: ["camera"],
    photo: "inspection-proof",
    note: "Staff check in with a badge or a code. No face recognition.",
    card: { meta: "Berth 4 · container seal check", title: "Inspection logged: 4 min 10 s" },
  },

  // ── 02 Safety & HSE ─────────────────────────────────────────────────────
  {
    id: "workplace-safety",
    group: "people",
    name: "Workplace safety (HSE)",
    short: "Workplace HSE",
    line: "Cameras around the workplace check, all day, that safety rules are followed, and keep the record for inspections.",
    watches:
      "Emergency exits and escape routes, walkways and forklift lanes, helmets and high-vis in marked zones, people under loads or near moving machines, fire equipment.",
    alert: "an emergency exit is blocked, someone without a helmet or vest enters a marked zone, or a person walks into a forklift lane",
    then: "The shift or site manager gets the picture and the place at once; every deviation lands in the HSE log.",
    buyers: "Warehouses, factories, workshops and construction companies: any workplace with safety rules to follow.",
    value: "Fewer accidents and near-misses, and HSE documentation ready for inspections and audits.",
    senses: ["camera"],
    photo: "warehouse-exit",
    note: "Detects situations, not identities. No face recognition.",
    card: { meta: "Hall D · exit by dock 49", title: "Emergency exit blocked by pallets" },
  },
  {
    id: "building-sites",
    group: "people",
    name: "Whole building sites",
    short: "Building sites",
    line: "Every camera on the site in one view: helmets and vests, every machine's reach, the danger zones and who is on site, day and night.",
    watches:
      "The whole site, from cameras on the fence, the gates, the crane and the machines: helmets and high-vis, the swing radius of every excavator, people under crane loads, open edges, shafts and excavations, trucks reversing where people walk, and anyone on site who shouldn't be.",
    alert: "someone without a helmet or vest enters a marked zone, a person stands inside an excavator's swing radius or under a crane load, an open edge has no barrier, or someone is on site after hours",
    then: "The site manager gets the picture and the camera at once; every deviation lands in one HSE log for the whole site.",
    buyers: "Contractors and construction companies running large sites, and the developers, clients and insurers who want proof of safe work.",
    value: "Fewer near-misses and accidents, one safety picture of the whole site, and HSE records the client and the inspector can see.",
    senses: ["camera"],
    photo: "site-wide",
    note: "Detects situations, not identities. No face recognition.",
    card: { meta: "Pit floor · slab edge", title: "People at the edge of the dig" },
  },
  {
    id: "falls",
    group: "people",
    name: "Someone who doesn't get up",
    short: "Falls",
    line: "Detects a fall, or someone lying still, and alerts staff or family within seconds.",
    watches: "A fall, no movement afterwards, a night-time walk that doesn't end. In care homes, at home, and in places without staff.",
    alert: "a resident falls, or has not got up within 2 minutes",
    then: "The alert reaches the night nurse's phone. By default only the event is shared, not the video.",
    buyers: "Care homes, home-care services, 24/7 gyms, self-service businesses and families.",
    value: "Help in minutes, not hours.",
    senses: ["camera", "sensor"],
    photo: "fall-detection",
    note: "Privacy first: events, not video, by default.",
    card: { meta: "Room 214 · 02:47", title: "Fall detected, nurse alerted" },
  },
  {
    id: "leisure-zones",
    group: "people",
    name: "Parks, rides & ranges",
    short: "Parks & ranges",
    line: "Watches the danger zones in leisure: someone under a trampoline, inside a ride's fence, or forward of the firing line.",
    watches: "Under and between trampoline beds, ride fences and gates while the ride runs, the firing line and every lane at a shooting range.",
    alert: "someone crawls under a trampoline, a person is inside the fence while the ride runs, or a muzzle sweeps across another shooter",
    then: "The operator or range officer is alerted at once, with the camera view.",
    buyers: "Trampoline parks, activity centers, amusement parks and shooting clubs.",
    value: "An extra set of eyes on every bed, ride and lane, all the time.",
    senses: ["camera"],
    photo: "trampoline-parks",
    note: "Supports staff and range officers. Never replaces their rules or supervision.",
    card: { meta: "Court 3 · bed 7", title: "Person under the bed" },
  },
  {
    id: "marinas",
    group: "people",
    name: "Water after dark",
    short: "Marinas & pools",
    line: "Marinas, ferry quays and hotel pools after closing: sees a person in the water, or someone where they shouldn't be.",
    watches: "Docks, gangways, quay edges and ramps, pool areas and the water, with thermal as an option after dark.",
    alert: "a person goes into the water, or someone is on the docks or in the pool after closing",
    then: "Harbor staff, the night desk or the guard on call get the exact spot.",
    buyers: "Marinas and yacht clubs, ferry operators, hotels, spas and holiday parks.",
    value: "When someone falls in at night, minutes decide.",
    senses: ["camera"],
    options: ["thermal"],
    photo: "marinas",
    note: "Supports lifeguards. Never replaces them.",
    card: { meta: "Dock C · 01:32", title: "Person in the water" },
  },

  // ── 03 Theft & break-ins ────────────────────────────────────────────────
  {
    id: "site-materials",
    group: "theft",
    name: "Copper, cables & tools",
    short: "Copper & tools",
    line: "Watches what thieves come for on sites and in yards: copper, cable drums, tools and building materials.",
    watches: "Cable drums, copper, tool containers, stacked materials and the fence around them.",
    alert: "someone is near the cable drums after closing, or a tool container opens outside working hours",
    then: "The owner or the guard gets the picture at once, while there is still time to act.",
    buyers: "Construction companies, electricians and plumbers, builders' merchants, scrapyards and utilities with cable stores.",
    value: "Less theft, and fewer jobs standing still while new materials are ordered.",
    senses: ["camera"],
    photo: "site-materials",
    card: { meta: "Turbine pad · cable drums", title: "Copper cable left unguarded" },
  },
  {
    id: "night-visitors",
    group: "theft",
    name: "Night visitors",
    short: "Night visitors",
    line: "Sees the person on site after closing, or the car that waits by the gate with its lights off.",
    watches: "Fences, gates and yards after hours, and cars that circle, stop or wait in the dark.",
    alert: "a person is inside the fence at 02:40, or a car stops by the gate with its lights off",
    then: "A guard, the owner or the alarm company gets the picture and decides.",
    buyers: "Building sites, yards and depots, car dealers, farms: any business that closes at night.",
    value: "Scouting spotted before the break-in, not after.",
    senses: ["camera"],
    options: ["thermal"],
    photo: "idea-night",
    note: "Looks at situations, not faces. No face or plate recognition.",
    card: { meta: "Car park · 02:40", title: "Vehicle waiting with its lights off" },
  },
  {
    id: "shop-theft",
    group: "theft",
    name: "Shop theft",
    short: "Shop theft",
    line: "Notices goods slipped into a pocket or bag, and items that go through self-checkout without a scan.",
    watches: "Aisles with high-value goods, the scanner, the bagging area and the basket at each checkout.",
    alert: "an item goes into the bag without a scan, or goods disappear into a bag in the aisle",
    then: "A staff member gets a discreet notice for that aisle or checkout.",
    buyers: "Grocery stores, pharmacies, hardware and electronics stores, kiosks and gas stations.",
    value: "Less loss without more staff on the floor.",
    senses: ["camera"],
    photo: "self-checkout",
    note: "Looks at items and actions, not faces. No face recognition.",
    card: { meta: "Checkout 4", title: "Item bagged, not scanned" },
  },
  {
    id: "equipment-yards",
    group: "theft",
    name: "Machines & equipment yards",
    short: "Equipment yards",
    line: "Watches outdoor machine parks and their high-value equipment around the clock.",
    watches: "Machines, gates, fuel tanks and anyone in the yard after hours, and each machine's condition at check-out and return.",
    alert: "a machine moves after 22:00, or someone enters the yard at night",
    then: "The guard or owner is alerted with the picture; check-out photos settle damage disputes.",
    buyers: "Machine rental companies, contractors' depots, car, boat and equipment dealers.",
    value: "Less theft, and fewer disputes over expensive equipment.",
    senses: ["camera"],
    options: ["thermal"],
    photo: "rental-yards",
    card: { meta: "North yard · 02:20", title: "Excavator moving after hours" },
  },

  // ── 04 Water & weather ──────────────────────────────────────────────────
  {
    id: "basement-water",
    group: "water",
    name: "Water in the basement",
    short: "Basement water",
    line: "Sees water on the floor, a dripping pipe or a leaking water heater before it becomes a flooded basement.",
    watches: "Basement floors, boiler rooms, water heaters, pipes, drains and shared laundry rooms.",
    alert: "water spreads across the floor under the water heater for 3 minutes",
    then: "The caretaker or property manager gets the picture and the place, day or night.",
    buyers: "Housing co-ops, landlords, property managers, shops and offices with a basement.",
    value: "A wet floor found in minutes, not a flooded basement found on Monday.",
    senses: ["camera"],
    options: ["sensor"],
    photo: "basement-water",
    card: { meta: "Basement · laundry room", title: "Water on the floor" },
  },
  {
    id: "pump-stations",
    group: "water",
    name: "Unmanned pump stations",
    short: "Pump stations",
    line: "Watches pumps, flanges, pipes and the floor for visible leaks or beginning flooding between visits.",
    watches: "Pumps, flanges, pipes and the floor; motor heat; the door.",
    alert: "water spreads across the floor under pump 2, or the door opens with no visit planned",
    buyers: "Municipal water and wastewater utilities, waterworks and industrial companies, including stormwater pump stations.",
    value: "Critical infrastructure gets active monitoring instead of a weekly visit.",
    senses: ["camera"],
    options: ["thermal"],
    photo: "pump-stations",
    flagship: true,
    card: { meta: "Pump station 3 · pump 2", title: "Water on the floor, spreading" },
  },
  {
    id: "garage-flood",
    group: "water",
    name: "Garages & underpasses",
    short: "Garages & underpasses",
    line: "Sees water coming down a garage ramp or collecting under a bridge, while there is still time to move the cars.",
    watches: "Ramps, entrances, drains and low points, read against a fixed depth marker.",
    alert: "water enters at the ramp, or rises 5 cm in 10 minutes at the lowest point",
    then: "Screens and signs warn drivers, the operator is called and the barriers close.",
    buyers: "Parking garage owners, shopping centers, housing associations, municipalities and road authorities.",
    value: "Cars moved before the water arrives, and nobody driving into deep water.",
    senses: ["camera", "sensor"],
    photo: "garage-flood",
    card: { meta: "Level −2 · ramp entrance", title: "Water coming in for 3 min" },
  },
  {
    id: "weather",
    group: "water",
    name: "Snow, ice & storms",
    short: "Snow & storms",
    line: "Watches roofs, gutters and yards when the weather turns: snow piling up, icicles over a door, materials left out in the rain.",
    watches: "Snow depth on flat roofs, icicles over entrances, tarps and covers on stored materials, gutters and drains.",
    alert: "snow on the roof passes the depth marker, or icicles form over the main entrance",
    then: "The caretaker gets the picture with time to clear it safely.",
    buyers: "Property owners, shops and warehouses with flat roofs, holiday cabin owners, building sites and municipalities.",
    value: "Roofs cleared and entrances made safe before something gives way.",
    senses: ["camera"],
    photo: "weather-roof",
    card: { meta: "Roof edge · north side", title: "Snow sliding off the roof" },
  },
  {
    id: "sewers",
    group: "water",
    name: "Sewers & flood defenses",
    short: "Sewers & flood defenses",
    line: "Cameras and level sensors inside sewers, overflows and flood barriers spot blockages, rising water and damage.",
    watches: "Flow and water level, debris at screens and grates, overflow chambers, flood gates.",
    alert: "the overflow chamber rises 20 cm in 10 minutes, or debris blocks the inlet screen",
    buyers: "Municipal water and wastewater utilities, waterworks and flood-protection operators.",
    value: "Fewer flooded basements and unnoticed overflows, and a record of every event.",
    senses: ["camera", "sensor"],
    photo: "sewers",
    card: { meta: "Overflow chamber 7", title: "Level +20 cm in 10 min" },
  },

  // ── 05 Buildings & self-service ─────────────────────────────────────────
  {
    id: "apartments",
    group: "buildings",
    name: "Apartment buildings",
    short: "Apartment buildings",
    line: "Keeps an eye on the shared spaces: doors left open, bikes in the escape route, rubbish dumped in the bin room.",
    watches: "Entrances and garage doors, stairwells, bike and bin rooms, shared laundry rooms.",
    alert: "the garage door stays open for 10 minutes, bikes block the fire door, or rubbish piles up beside the bins",
    then: "The caretaker or the board gets the picture; recurring problems show up in a weekly summary.",
    buyers: "Housing co-ops, condominium boards, landlords and property managers.",
    value: "Fewer break-ins, tidier shared spaces and escape routes that stay open.",
    senses: ["camera"],
    photo: "apartments-common",
    note: "Shared spaces only. Never inside homes.",
    card: { meta: "Bin room · paper", title: "Bins overflowing onto the floor" },
  },
  {
    id: "self-service",
    group: "buildings",
    name: "Self-service businesses",
    short: "Self-service",
    line: "Laundries, car washes and solariums without staff: sees a machine that stops, a leak, vandalism or someone who needs help.",
    watches: "Machines and their displays, floors, doors and the shared room.",
    alert: "a machine shows an error for 5 minutes, a car sits in a wash bay without washing, or someone damages the payment terminal",
    then: "The owner gets the picture on the phone and can fix it before the next customer.",
    buyers: "Self-service laundries, car washes, solariums, 24/7 gyms and vending kiosks.",
    value: "Fewer hours with a machine out of order, and less vandalism.",
    senses: ["camera"],
    photo: "carwash",
    note: "Never inside tanning booths or changing rooms.",
    card: { meta: "Wash bay 2 · self-service", title: "Car parked in the bay, no wash running" },
  },
  {
    id: "shops",
    group: "buildings",
    name: "Shops & shopping centers",
    short: "Shop floor",
    line: "Queues at the till, empty shelves, and anonymous counts of where people go and how long they stay.",
    watches: "Tills, shelves, entrances, walkways and zones. Counted, never identified.",
    alert: "the queue at the tills passes 6 people, or a zone's footfall changes sharply from its normal week",
    then: "Staff open another till or restock; weekly numbers help with staffing, opening hours and leasing.",
    buyers: "Shops, grocery stores, shopping center owners and large retailers.",
    value: "Shorter queues, fuller shelves and decisions based on how people actually shop.",
    senses: ["camera"],
    photo: "mall-flows",
    note: "No faces, no identities, no tracking across visits.",
    card: { meta: "Level 1 · food court", title: "Saturday dwell time up sharply" },
  },
  {
    id: "kitchens",
    group: "buildings",
    name: "Restaurants & kitchens",
    short: "Kitchens",
    line: "Sees a cold-room door left open, the fryer still on after closing, and gloves or hairnets missing at the prep table.",
    watches: "Cold-room and freezer doors, prep tables, hand-wash stations, the kitchen after closing.",
    alert: "the cold-room door has been open for 5 minutes, food has been out of the fridge for 2 hours, or the fryer is still on after closing",
    then: "The chef or the owner gets the picture before the food is lost.",
    buyers: "Restaurants, cafés, bakeries, canteens and catering kitchens.",
    value: "Less food thrown away, and food-safety routines you can show the inspector.",
    senses: ["camera"],
    photo: "restaurant-cold",
    note: "Detects situations, not identities.",
    card: { meta: "Prep table · cold chain", title: "Tray out of the fridge for 2 hours" },
  },

  // ── 06 Production & logistics ───────────────────────────────────────────
  {
    id: "production-lines",
    group: "production",
    name: "Production lines",
    short: "Production lines",
    line: "Sees the bottle that falls, the line that jams and the spill on the floor, the minute it happens.",
    watches: "Conveyors, fillers and packers, fallen products, empty stretches, spills by the line.",
    alert: "products pile up at the filler, or the line has run empty for 2 minutes",
    then: "The operator is called to the right spot, with the picture.",
    buyers: "Dairies, bakeries, breweries, food and packaging producers, small factories.",
    value: "Shorter stops and less waste on every shift.",
    senses: ["camera"],
    photo: "dairy-line",
    card: { meta: "Cup filler · outfeed", title: "Line stopped, no cups for 4 minutes" },
  },
  {
    id: "loading-docks",
    group: "production",
    name: "Warehouses & loading docks",
    short: "Loading docks",
    line: "Dock doors left open, pallets in walkways and trucks waiting too long, measured and flagged.",
    watches: "Dock doors and bays, walkways and forklift lanes, the gate and the truck queue.",
    alert: "a dock door stays open with no truck for 10 minutes, or a truck has queued for more than 45 minutes",
    then: "Weekly reports show where the time goes, so arrivals and slots can be planned.",
    buyers: "Warehouses, wholesalers, freight terminals, grain receiving and industrial sites.",
    value: "Lower heating bills, fewer delays and better-planned arrivals.",
    senses: ["camera"],
    photo: "truck-waiting",
    card: { meta: "Gate 2 · queue", title: "Waiting 52 min, above target" },
  },
  {
    id: "robot-cells",
    group: "production",
    name: "Robot & welding cells",
    short: "Robot cells",
    line: "Sees when a robot cell needs a person because the part slipped, not because the robot failed.",
    watches: "The workpiece in its fixture, parts on the floor, the state of the cell, sparks and smoke out of pattern.",
    alert: "a part is not seated in the fixture when the cycle starts, or lies on the cell floor",
    then: "An operator is called to the right cell, with a picture of the problem.",
    buyers: "Manufacturers running welding and handling robots, especially on unmanned night shifts.",
    value: "Less idle time between maintenance. Problems fixed in minutes, not at shift change.",
    senses: ["camera"],
    photo: "robot-cells",
    card: { meta: "Weld cell 3 · fixture B", title: "Part not seated, operator called" },
  },
  {
    id: "machine-health",
    group: "production",
    name: "Machine health",
    short: "Machine health",
    line: "Thermal cameras and vibration sensors follow motors, pumps, fans, winch brakes and transformers, and show when a fault is on its way.",
    watches: "Bearings, brakes, cable terminations and cooling: their temperature and vibration, and how both trend over weeks.",
    alert: "a bearing runs 15 °C above its twin for 30 minutes, or vibration has risen three weeks in a row",
    then: "The trend shows how fast it is getting worse, so the repair can be planned before it fails.",
    buyers: "Food production, process industry, utilities and grid operators, offshore and heavy lift, aquaculture.",
    value: "Planned repairs instead of breakdowns.",
    senses: ["thermal", "vibration"],
    photo: "machine-health",
    note: "An extra early warning. Safety-critical brakes and switchgear keep their own approved monitoring.",
    card: { meta: "Motor M-4 · drive-end bearing", title: "+15 °C vs. its twin and rising" },
  },
  {
    id: "waste-fire",
    group: "production",
    name: "Waste & recycling fires",
    short: "Waste fires",
    line: "Normal and thermal cameras watch bunkers, piles and bales for heat building up inside, long before there is smoke.",
    watches: "Surface temperature across piles and bunkers, hot spots, smoke and sparks.",
    alert: "a spot in the pile is 25 °C warmer than its surroundings and still rising",
    then: "The operator on call gets the exact spot, so it can be dug out or cooled while it is small.",
    buyers: "Waste-to-energy plants, recycling stations, municipal waste companies and scrapyards.",
    value: "Fires stopped while they are small, including the ones that smolder deep inside a pile.",
    senses: ["camera", "thermal"],
    photo: "waste-fire",
    card: { meta: "Bunker 2 · zone C4", title: "Hot spot +25 °C and rising" },
  },

  // ── 07 Farms & animals ──────────────────────────────────────────────────
  {
    id: "animal-health",
    group: "farms",
    name: "Animal health",
    short: "Animal health",
    line: "Sees an animal lying apart or still for too long, and the first signs of calving or lambing.",
    watches: "Lying and standing time, animals apart from the herd, calving and lambing pens, feeding and drinking.",
    alert: "a cow has lain apart from the herd for 3 hours, or calving starts at 02:00",
    then: "The farmer gets the pen and the picture, at 3 a.m. if needed.",
    buyers: "Dairy and beef farms, sheep farmers, stables and pig producers.",
    value: "Help in time for a sick animal or a hard birth.",
    senses: ["camera"],
    options: ["thermal"],
    photo: "cow-barn",
    note: "Signs are checked by the farmer or the vet.",
    card: { meta: "Straw pen · cow 2", title: "Cow lying down for 3 hours" },
  },
  {
    id: "barns",
    group: "farms",
    name: "Barn behavior",
    short: "Barn behavior",
    line: "Measures activity, how the animals spread out and unusual changes at group level, and warns if an animal may have died.",
    watches: "Activity level, distribution across the house, clustering, animals that stop moving.",
    alert: "the flock avoids one zone for 30 minutes, or an animal has not moved for 4 hours",
    then: "The farmer gets the zone and the picture, at 3 a.m. if needed.",
    buyers: "Poultry producers and larger livestock farms.",
    value: "Earlier signs of problems with ventilation, water, feed or health.",
    senses: ["camera"],
    options: ["thermal"],
    photo: "livestock-barns",
    note: "Biological signals are checked and interpreted by the farm's responsible staff.",
    card: { meta: "House 2 · zone 4", title: "Activity far below normal" },
  },
  {
    id: "gates-water",
    group: "farms",
    name: "Gates, fences & water",
    short: "Gates & water",
    line: "An open gate, an empty water trough or animals out on the road, seen before they become a problem.",
    watches: "Gates, fence lines, water troughs and feeders, the road along the pasture.",
    alert: "the gate to the road has been open for 10 minutes, or the trough has been empty since morning",
    then: "The farmer gets the picture and the place.",
    buyers: "Sheep and cattle farmers, horse owners and grazing associations.",
    value: "Fewer escaped animals, and none left without water.",
    senses: ["camera"],
    photo: "farm-gate",
    card: { meta: "Field gate · road", title: "Gate left open onto the road" },
  },
  {
    id: "predators",
    group: "farms",
    name: "Predator warning",
    short: "Predator warning",
    line: "Cameras at the edge of the pasture spot wolves, bears, lynx and wolverines. Thermal adds range at night.",
    watches: "Fence lines, the forest edge and the ground around the flock.",
    alert: "a large predator crosses into the pasture at 03:12",
    then: "The farmer gets a text with the picture; lights or sound can be switched on to scare it off.",
    buyers: "Sheep and cattle farmers and grazing associations.",
    value: "Time to act before an attack, and pictures that document what happened.",
    senses: ["camera"],
    options: ["thermal"],
    photo: "predator-animal",
    card: { meta: "North pasture · 03:12", title: "Predators near the flock" },
  },
];

export const servicesIn = (g: GroupId) => SERVICES.filter((s) => s.group === g);

export const SENSE_LABEL: Record<Sense, string> = {
  camera: "Camera",
  thermal: "Thermal",
  vibration: "Vibration",
  sensor: "Sensors",
};

// ── Slides ────────────────────────────────────────────────────────────────

export const CONTACT_EMAIL = "contact@enlightlayer.com";

export const COVER = {
  title: "Enlight Layer",
  tagline: "Custom AI monitoring on cameras and sensors, for the places nobody watches.",
  markets: "Europe · North America",
  /** the banner line above the title */
  eyebrow: "For small and medium businesses · Europe & North America",
  /** the strip along the bottom of the cover */
  proof: [
    { title: "Existing cameras first", text: "An ordinary camera and a phone. New hardware only where it's needed." },
    { title: "Custom-built", text: "One model per problem, trained for the site it watches." },
    { title: "Europe & North America", text: "Small and medium businesses first." },
    { title: "An alert with the picture", text: "The right person gets the picture, not a video wall." },
  ],
  /** the banner cycles through these scenarios: one service each (place = callout above or below the problem) */
  reel: [
    { service: "building-sites", photo: "site-wide", zoom: 1.6, at: [0.6, 0.58], cam: "CAM 01", clock: "07:42:19", label: "Whole building sites · site overview" },
    { service: "shop-theft", photo: "self-checkout", cam: "CAM 04", clock: "17:26:40", label: "Shop theft · self-checkout" },
    { service: "robot-cells", photo: "robot-cells", cam: "CAM 06", clock: "10:12:40", label: "Robot & welding cells · weld cell 3" },
    { service: "marinas", photo: "marinas", cam: "CAM 09", clock: "01:32:05", label: "Water after dark · marina" },
    {
      service: "predators",
      photo: "predator-watch",
      cam: "CAM 05",
      clock: "05:48:12",
      place: "below",
      card: { meta: "North pasture · forest edge", title: "Predators near the flock" },
      label: "Predator warning · north pasture",
    },
    {
      service: "site-materials",
      photo: "night-yard",
      cam: "CAM 07",
      clock: "02:40:33",
      card: { meta: "Street works · 02:40", title: "Tools and cable left out overnight" },
      label: "Copper, cables & tools · street works",
    },
  ] as {
    service: string;
    photo: string;
    mirror?: boolean;
    place?: "above" | "below";
    /** crop tighter around the problem than a plain cover */
    zoom?: number;
    /** where in the frame the problem sits (fractions), when the photograph has it too low or too high */
    at?: readonly [number, number];
    cam: string;
    clock: string;
    label: string;
    card?: { meta: string; title: string };
  }[],
};

export const PROBLEM = {
  title: "Cameras record. Nobody watches.",
  points: [
    {
      title: "Rounds miss the in-between.",
      text: "Plants, stations and buildings are still checked by people on foot. Most problems start between two rounds.",
    },
    {
      title: "Old equipment is offline.",
      text: "The gauges, panels and machines that run critical sites were built before the internet. Replacing them costs a fortune.",
    },
    {
      title: "Video AI stops at the obvious.",
      text: "Off-the-shelf analytics counts people and spots intruders. The specific, expensive problems are left to chance.",
    },
  ],
};

export const LAYERS = [
  { n: 0, name: "Physical", line: "The site as it is: machines, stations, docks, barns.", short: "The site as it is." },
  {
    n: 1,
    name: "Sensing",
    line: "Cameras and sensors. Existing ones first; thermal, vibration or level where needed.",
    short: "Existing cameras first, sensors where needed.",
  },
  { n: 2, name: "Intelligence", line: "A model trained for one specific problem, at that site.", short: "A model for one problem, at one site." },
  { n: 3, name: "Action", line: "A clear alert with the picture, sent to the person who acts.", short: "An alert with the picture, to the person who acts." },
] as const;

export const SOLUTION = {
  title: "One layer on top of what's already there.",
  text: "We build a custom AI monitor for each problem: on the customer's cameras where they can see enough, with new cameras or sensors where they can't.",
  photo: "pump-stations",
  alert: { meta: "Station 3 · pump 2", title: "Water on the floor, spreading" },
};

export const IDEAS = {
  kicker: "Everyday ideas",
  title: "Ideas for the cameras you already have.",
  text: "Most of these need nothing more than an ordinary camera and a phone.",
  tags: ["Safety", "Theft", "Leaks & damage", "Downtime"],
  /** photo cards; the first is the big one */
  groups: [
    {
      id: "sites",
      name: "Building sites",
      main: true,
      photo: "idea-site",
      items: ["Helmets and vests in marked zones", "people inside a machine's reach", "materials left out in the rain"],
    },
    { id: "storage", name: "Warehouses & shipping", photo: "idea-warehouse", items: ["Pallets in walkways", "people near forklifts", "dock doors left open"] },
    { id: "shops", name: "Shops", photo: "idea-shop", items: ["Goods slipped into a pocket", "items bagged without a scan", "queues at the till"] },
    { id: "homes", name: "Apartment buildings", photo: "idea-apartments", items: ["Doors left open", "water in the basement", "bikes blocking escape routes"] },
    { id: "production", name: "Dairies & production lines", photo: "idea-production", items: ["Bottles falling", "line jams and stops", "spills by the line"] },
    { id: "farms", name: "Farms & animals", photo: "idea-farm", items: ["An animal lying still too long", "calving and lambing", "empty troughs, open gates"] },
    {
      id: "selfservice",
      name: "Laundries & self-service",
      photo: "idea-selfservice",
      items: ["Machine errors and leaks", "damage and vandalism", "someone who falls"],
    },
  ],
};

export const MORE_IDEAS = {
  kicker: "More ideas",
  title: "More ideas. Bring your own.",
  text: "If a person standing there could see it, a camera can watch for it.",
  night: {
    id: "night",
    name: "Nights & after hours",
    photo: "night-yard",
    items: ["Someone on site after closing", "a car circling with its lights off", "people near copper, cables and tools"],
  },
  ideas: [
    { id: "boat", place: "Boat owners", text: "A boat sitting lower in the water than yesterday." },
    { id: "chargers", place: "Car chargers", text: "A charging cable cut or pulled at night." },
    { id: "selfstorage", place: "Self-storage", text: "A unit door left open after closing." },
    { id: "recycling", place: "Recycling stations", text: "A full container, or rubbish dumped beside it." },
    { id: "parking", place: "Parking", text: "A car blocking the fire lane or a charger." },
    { id: "stable", place: "Stables", text: "A horse down in its stall that can't get up." },
    { id: "school", place: "Schools", text: "The playground gate left open." },
    { id: "lobby", place: "Hotels & lobbies", text: "A bag left alone for too long." },
    { id: "campsite", place: "Campsites", text: "A barbecue or campfire left burning." },
    { id: "heritage", place: "Wooden buildings", text: "Smoke or flames near a stave church or old house." },
    { id: "graffiti", place: "Property owners", text: "Fresh graffiti on the wall overnight." },
    { id: "greenhouse", place: "Greenhouses", text: "A roof vent stuck shut on a hot day." },
  ],
  how: ["Your camera", "A model for that one problem", "An alert with the picture on your phone"],
  fine: "No face recognition. Never in changing rooms, tanning booths or inside homes.",
  cta: "Have an idea of your own? Tell us.",
};

export const WHY = {
  kicker: "Why custom",
  title: "Watching a site isn't one task. It's thousands.",
  text: "Every camera sees hundreds of small things that can go wrong, and each looks different at every site. A person on site makes these calls in seconds. We train a model to make the same call.",
  reels: [
    [
      { photo: "garage-flood", place: "Parking garage", task: "Watch the ramp in heavy rain", call: "Just wet, or a flood starting?" },
      { photo: "weather-roof", place: "Apartment roof", task: "Watch the snow on the eaves", call: "Fine, or about to slide?" },
    ],
    [
      { photo: "cow-barn", place: "Dairy barn", task: "Watch the cow lying apart", call: "Resting, or calving?" },
      { photo: "dairy-line", place: "Dairy line", task: "Watch the filler", call: "A short stop, or a jam?" },
      { photo: "self-checkout", place: "Self-checkout", task: "Watch checkout 4", call: "Scanned, or just bagged?" },
    ],
    [
      { photo: "carwash", place: "Car wash", task: "Watch the bays", call: "Rinsing, or a burst hose?" },
      { photo: "waste-fire", place: "Recycling", task: "Watch the pile", call: "Steam, or smoke?" },
    ],
  ] as { photo: string; place: string; task: string; call: string }[][],
  ticker: [
    "A drip, or a leak?",
    "Door open, or just ajar?",
    "Shadow, or a person?",
    "Resting, or down?",
    "Normal queue, or too long?",
    "A helmet, or just a hood?",
    "A delivery, or a theft?",
    "Paused, or jammed?",
    "Wet floor, or a spill?",
    "A deer, or a wolf?",
    "Open hours, or after closing?",
    "Gate shut, or left open?",
    "Lights off, or left on?",
    "Alert now",
    "Log it",
    "Wait and see",
    "It's fine",
  ],
  more: "+ thousands more",
};

export const FOCUS = {
  kicker: "Seven areas",
  title: "Seven areas. Old equipment first.",
  text: "Everyday problems first, and the niche ones nobody else has packaged.",
  tags: ["Checks", "Readings", "Alerts", "Proof"],
  main: "rounds" as GroupId,
  /** one photograph per area card */
  photos: {
    rounds: "legacy-panels",
    people: "warehouse-exit",
    theft: "site-materials",
    water: "garage-flood",
    buildings: "apartments-common",
    production: "dairy-line",
    farms: "cow-barn",
  } as Record<GroupId, string>,
};

export const FLAGSHIP = {
  kicker: "Where we start",
  title: "Old equipment online at about 1/25 of the price.",
  text: "Boiler rooms, pump rooms, dairies and workshops run on equipment that was never connected. Replacing the control system means new panels, rewiring and downtime. We point a camera at what's already there and watch it around the clock.",
  facts: [
    { title: "No shutdown", text: "Nothing is opened, rewired or replaced." },
    { title: "Data from day one", text: "Every reading, every minute, with history." },
    { title: "Any brand, any age", text: "If a person can read it, a camera can." },
  ],
  compare: [
    { label: "Replacing the control system", value: 25, note: "New panels, wiring, integration, downtime" },
    { label: "Enlight Layer camera retrofit", value: 1, note: "Camera, model and alerts on the existing panel" },
  ],
  footnote: "Our estimate for a typical retrofit. Every site is quoted individually.",
  photo: "boiler-gauges",
  card: { meta: "Plant room · read every minute", title: "Supply 58 °C, normal", kind: "reading" as const },
};

/** Building sites as one operation: the slide after Safety & HSE */
export const SITE = {
  id: "building-sites",
  kicker: "Building sites",
  title: "The whole building site, in one view.",
  text: "Cameras on the fence, the gates, the crane and the machines feed one view of the site, day and night.",
  checks: [
    { title: "Helmets & high-vis", text: "Anyone without them in a marked zone." },
    { title: "Machine reach", text: "People in an excavator's swing radius or under a crane load." },
    { title: "Danger zones", text: "Open edges, shafts and pits without a barrier." },
    { title: "People who shouldn't be there", text: "After hours, through the fence or in a closed zone." },
    { title: "Trucks & walkways", text: "People on foot where trucks reverse." },
    { title: "One HSE log", text: "Every deviation with its picture, for the site manager." },
  ],
  overview: { slug: "site-wide", cam: "CAM 01 · Site overview", tags: ["At the edge of the dig", "At height, no guard rail"] },
  feeds: [
    { slug: "site-crane", cam: "CAM 02 · Crane", alert: "Person under the load" },
    { slug: "site-ppe", cam: "CAM 03 · Pit north", alert: "No helmet in the zone" },
    { slug: "site-edge", cam: "CAM 04 · Trench 2", alert: "No PPE at an open edge" },
    { slug: "site-gate", cam: "CAM 05 · Gate 1", alert: "Site gate left open" },
  ],
  logLabel: "Example log",
  log: [
    { time: "07:42", text: "At the edge of the dig, pit floor" },
    { time: "09:15", text: "No helmet, pit north" },
    { time: "13:02", text: "Under the load, crane" },
    { time: "18:10", text: "Gate left open, gate 1" },
  ],
  note: "Example scenes. Detects situations, not identities. No face recognition.",
};

export const DEPLOY = {
  kicker: "How it's deployed",
  title: "From first call to first alert in four steps.",
  text: "Existing cameras first. A camera on old equipment, or new sensors on 4G and solar, only where the problem needs it.",
  photo: "existing-camera",
  steps: [
    { title: "Scope", text: "One problem at one site, like a wet basement or an open gate. A few camera stills, and what an alert should mean." },
    { title: "Pilot", text: "A few weeks on one site, tuned with the people who will get the alerts." },
    { title: "Roll out", text: "More cameras, more sites, on the same layer." },
    { title: "Run", text: "We watch the models and keep improving them." },
  ],
  where: "Analysis runs on site, in the cloud, or split between them.",
};

export const TRUST = {
  title: "Private by design.",
  text: "Many services watch places where people are: sites, shops and shared spaces. They are built for European privacy rules from the start.",
  points: [
    { title: "Situations, not identities", text: "We detect events: a fall, a blocked exit, water on the floor, a person in a danger zone. No face recognition." },
    { title: "Data stays where it should", text: "Analysis can run on site, so only the event and a snapshot leave it." },
    { title: "People decide", text: "Every alert goes to a person who decides what to do next." },
    { title: "An extra layer, not a replacement", text: "We add to alarms, guards, lifeguards and inspections. We never replace certified safety systems." },
  ],
};

export const MARKET = {
  title: "Europe and North America.",
  regions: [
    { title: "North America", sub: "United States · Canada" },
    { title: "Europe", sub: "EU · EEA · UK · Switzerland · Eastern Europe" },
  ],
  text: "The same everyday problems exist in every town: building sites, shops, apartment buildings, farms and small factories. And in the old stations and unmanned sites between them.",
  why: [
    { title: "Cameras are everywhere", text: "Most shops, sites and buildings already have cameras that nobody watches." },
    { title: "Sensors are cheap", text: "Thermal cameras and vibration sensors cost a fraction of what they used to." },
    { title: "AI runs on site", text: "Models now run on a small box on site, so video doesn't have to leave the site." },
    { title: "Old infrastructure stays", text: "It isn't being replaced fast enough, but it can be read." },
  ],
  buyers: [
    "Construction companies",
    "Shops & grocery",
    "Housing co-ops & landlords",
    "Property managers",
    "Warehouses & logistics",
    "Food & dairy production",
    "Small manufacturers",
    "Restaurants & cafés",
    "Farms & livestock",
    "Laundries & car washes",
    "Electricians & plumbers",
    "Car & machine dealers",
    "Equipment rental",
    "Hotels & resorts",
    "Care homes & home care",
    "Gyms & activity parks",
    "Parking operators",
    "Marinas & yacht clubs",
    "Municipal water & wastewater",
    "Grid operators",
    "Process industry",
    "Waste & recycling",
    "Ports & ferry operators",
    "Offshore & heavy lift",
    "Shooting ranges",
    "Road authorities",
  ],
};

export const CONTACT = {
  kicker: "Let's talk",
  title: "Custom AI on the cameras you already have.",
  text: "Tell us about one problem at one site. We'll tell you what a camera could catch, and what it would take.",
  cta: "Email us",
  pdf: "Download the deck (PDF)",
  back: "Back to the start",
  photo: "robot-cells",
  mirror: false,
  fine: "Photographs are openly licensed pictures of real places, used as illustrations, not Enlight Layer sites or customers. Alerts shown are examples.",
};
