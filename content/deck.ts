// All copy for the pitch deck lives here. Built from the owner's list in
// docs/service-ideas-2026-11-11.md — every service keeps the owner's idea and
// adds what it watches, an example alert, who buys it and why it pays.
// Alerts are examples, not measured results. No customers, prices or traction
// are claimed anywhere.

export type Sense = "camera" | "thermal" | "vibration" | "sensor";

export type GroupId = "rounds" | "water" | "machines" | "people" | "night" | "farms" | "operations";

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
    title: "Old equipment, read by camera.",
    line: "Panels, gauges and inspection rounds — digitized without touching the equipment.",
    tone: "paper",
  },
  {
    id: "water",
    name: "Water & flooding",
    title: "Water where it shouldn't be.",
    line: "Unmanned stations, sewers and low points — watched between visits.",
    tone: "dark",
  },
  {
    id: "machines",
    name: "Machines & energy",
    title: "Machines that warn before they fail.",
    line: "Heat and vibration show most faults days or weeks before the breakdown.",
    tone: "paper",
  },
  {
    id: "people",
    name: "People safety",
    title: "The second someone is in the wrong place.",
    line: "Sites where the risk is a person in a danger zone — or a person who doesn't get up.",
    tone: "dark",
  },
  {
    id: "night",
    name: "Water at night",
    title: "Water, darkness and nobody on duty.",
    line: "Marinas, ferry quays and pools after closing.",
    tone: "paper",
  },
  {
    id: "farms",
    name: "Farms & animals",
    title: "Animals, watched through the night.",
    line: "Behavior inside the barn and predators at the fence.",
    tone: "dark",
  },
  {
    id: "operations",
    name: "Operations & retail",
    title: "Time, traffic and loss — measured.",
    line: "Queues at the gate, machines in the yard, people on the shop floor.",
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
    line: "A camera in front of an old panel reads its dials, displays and lamps the way an operator would — and turns them into live data and alerts.",
    watches: "Analog gauges, counters, displays, indicator lamps and switch positions on panels that were never connected.",
    alert: "pressure on gauge P-3 stays above 6 bar for 5 minutes",
    then: "Readings flow into a dashboard or your existing systems; alerts go to whoever is on call.",
    buyers: "Industrial plants, utilities, hospitals and property owners with equipment older than their network.",
    value: "Digitized at about 1/25 of the price of replacing the system — no rewiring, no shutdown.",
    senses: ["camera"],
    photo: "legacy-panels",
    flagship: true,
    card: { meta: "Gauge P-3 · read every minute", title: "6.4 bar — above limit for 5 min" },
  },
  {
    id: "control-rounds",
    group: "rounds",
    name: "Digital control rounds",
    short: "Control rounds",
    line: "The daily round — gauges, leaks, doors, lamps — done by cameras every few minutes, and logged.",
    watches: "Every checkpoint on today's paper round: levels, drips, open doors, warning lamps, hot spots.",
    alert: "a checkpoint deviates from normal — staff walk only when something is actually wrong",
    buyers: "Buildings and plants that still run manual control rounds: plant rooms, district heating, water treatment, hospitals.",
    value: "A round every few minutes instead of once a shift — with a log that proves each one.",
    senses: ["camera", "thermal", "sensor"],
    photo: "plant-room",
    card: { meta: "Round 14:05 · 22 of 22 checkpoints", title: "Checkpoint 9 — drip under valve V-12" },
  },
  {
    id: "inspection-proof",
    group: "rounds",
    name: "Proof of inspection",
    short: "Proof of inspection",
    line: "Confirms — and documents — that a mandatory inspection really happened, at the right place, for the required time.",
    watches: "The checkpoint: the inspector present, the required steps carried out — seal checked, lashing checked, equipment tested.",
    alert: "an inspection is missed, cut short or done without its required steps",
    then: "Every inspection gets a timestamped evidence record, ready for the auditor.",
    buyers: "Ports, docks and terminals — and any operation with mandatory checks: cargo securing, lifting gear, fire safety, food safety.",
    value: "Audit-ready proof without paperwork. Nothing is skipped without anyone knowing.",
    senses: ["camera"],
    photo: "inspection-proof",
    note: "Inspectors check in with a badge or a code — no face recognition.",
    card: { meta: "Berth 4 · container seal check", title: "Inspection logged — 4 min 10 s" },
  },

  // ── 02 Water & flooding ─────────────────────────────────────────────────
  {
    id: "pump-stations",
    group: "water",
    name: "Unmanned pump stations",
    short: "Pump stations",
    line: "Watches pumps, flanges, pipes and the floor for visible leaks or beginning flooding — between visits.",
    watches: "Pumps, flanges, pipes and the floor; motor heat; the door.",
    alert: "water spreads across the floor under pump 2, or the door opens with no visit planned",
    buyers: "Municipal water and wastewater utilities, waterworks and industrial companies — including stormwater pump stations.",
    value: "Critical infrastructure gets active monitoring instead of a weekly visit.",
    senses: ["camera", "thermal"],
    photo: "pump-stations",
    flagship: true,
    card: { meta: "Pump station 3 · pump 2", title: "Water on the floor — spreading" },
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
    value: "Fewer flooded basements and unnoticed overflows — and a record of every event.",
    senses: ["camera", "sensor"],
    photo: "sewers",
    card: { meta: "Overflow chamber 7", title: "Level +20 cm in 10 min" },
  },
  {
    id: "underpass-flood",
    group: "water",
    name: "Underpass flood warning",
    short: "Underpass floods",
    line: "A camera watches a low point in the road and sees water collecting — before cars drive into it.",
    watches: "The road surface at the lowest point, read against a fixed depth marker.",
    alert: "water covers the lane and rises 5 cm in 10 minutes",
    then: "Warning signs switch on, the operations center is told, and traffic is stopped before the water gets deep.",
    buyers: "Municipalities, road authorities and private road operators.",
    value: "No cars stuck in deep water. Closures based on what is actually happening.",
    senses: ["camera"],
    photo: "underpass-flood",
    card: { meta: "Underpass · lowest point", title: "Water 14 cm — rising" },
  },
  {
    id: "garage-flood",
    group: "water",
    name: "Parking garage flood watch",
    short: "Garage floods",
    line: "Sees water coming down the ramps and warns everyone inside while there is still time to move the cars.",
    watches: "Ramps, entrances, drains and the lowest parking level.",
    alert: "water enters at the ramp, or stands over a drain for more than 3 minutes",
    then: "Screens and sirens warn drivers, the operator is called and the barriers close.",
    buyers: "Owners of premium parking garages, shopping centers, housing associations and property managers.",
    value: "Cars moved before the water arrives.",
    senses: ["camera", "sensor"],
    photo: "garage-flood",
    card: { meta: "Level −2 · ramp entrance", title: "Water coming in — 3 min" },
  },

  // ── 03 Machines & energy ────────────────────────────────────────────────
  {
    id: "machine-health",
    group: "machines",
    name: "Machine health",
    short: "Machine health",
    line: "Thermal cameras and vibration sensors follow every fixed motor, pump, fan and gearbox — and show when a fault is on its way.",
    watches: "Bearing and housing temperatures, vibration, and how both trend over weeks.",
    alert: "a bearing runs 15 °C above its twin for 30 minutes, or vibration has risen three weeks in a row",
    then: "The trend shows how fast it is getting worse, so the repair can be planned before it fails.",
    buyers: "Process industry, utilities, food production, mining and aquaculture — any site with critical rotating equipment.",
    value: "Planned repairs instead of breakdowns.",
    senses: ["thermal", "vibration"],
    photo: "machine-health",
    card: { meta: "Motor M-4 · drive-end bearing", title: "+15 °C vs. its twin — rising" },
  },
  {
    id: "robot-cells",
    group: "machines",
    name: "Robot & welding cells",
    short: "Robot cells",
    line: "Sees when a robot cell needs a person — because the part slipped, not because the robot failed.",
    watches: "The workpiece in its fixture, parts on the floor, the state of the cell, sparks and smoke out of pattern.",
    alert: "a part is not seated in the fixture when the cycle starts, or lies on the cell floor",
    then: "An operator is called to the right cell, with a picture of the problem.",
    buyers: "Manufacturers running welding and handling robots — especially on unmanned night shifts.",
    value: "Less idle time between maintenance. Problems fixed in minutes, not at shift change.",
    senses: ["camera"],
    photo: "robot-cells",
    card: { meta: "Weld cell 3 · fixture B", title: "Part not seated — operator called" },
  },
  {
    id: "winch-brakes",
    group: "machines",
    name: "Offshore winch brakes",
    short: "Winch brakes",
    line: "A fixed thermal camera follows the brakes and drivetrains of large winches and offshore cranes.",
    watches: "Brake bands, discs and the accessible drivetrain — during and after every lift.",
    alert: "a brake runs 40 °C above its normal after a lowering operation",
    buyers: "Offshore vessels, crane operators and heavy-lift companies.",
    value: "Abnormal friction heat can be an early sign of brake trouble — seen before the next lift.",
    senses: ["thermal"],
    photo: "winch-brakes",
    note: "An extra early warning. Safety-critical brakes still need their own approved monitoring.",
    card: { meta: "Main winch · brake band", title: "+40 °C after lowering" },
  },
  {
    id: "substations",
    group: "machines",
    name: "Transformers & substations",
    short: "Substations",
    line: "Thermal cameras and sensors on transformers and substations catch hot connections and cooling faults while they are still small.",
    watches: "Bushings, cable terminations, connections, cooling, oil, doors and water ingress.",
    alert: "one cable termination runs 20 °C above the other two phases at similar load",
    buyers: "Grid operators and industrial sites with their own substations.",
    value: "Safer, more reliable supply — fewer outages from faults that warm up for weeks.",
    senses: ["thermal", "sensor"],
    photo: "substations",
    card: { meta: "Substation T2 · phase L2", title: "+20 °C vs. the other phases" },
  },
  {
    id: "waste-fire",
    group: "machines",
    name: "Waste & recycling fires",
    short: "Waste fires",
    line: "Normal and thermal cameras watch bunkers, piles and bales for heat building up inside — long before there is smoke.",
    watches: "Surface temperature across piles and bunkers, hot spots, smoke and sparks.",
    alert: "a spot in the pile is 25 °C warmer than its surroundings and still rising",
    then: "The operator on call gets the exact spot, so it can be dug out or cooled while it is small.",
    buyers: "Waste-to-energy plants, recycling stations, municipal waste companies and scrapyards.",
    value: "Fires stopped while they are small — including the ones that smolder deep inside a pile.",
    senses: ["camera", "thermal"],
    photo: "waste-fire",
    card: { meta: "Bunker 2 · zone C4", title: "Hot spot +25 °C — rising" },
  },

  // ── 04 People safety ────────────────────────────────────────────────────
  {
    id: "construction-safety",
    group: "people",
    name: "Construction site safety",
    short: "Construction HSE",
    line: "Watches the whole site for the situations that lead to accidents — and tells the site manager right away.",
    watches: "Helmets and high-vis, people inside a machine's swing radius or under a load, open edges, closed zones.",
    alert: "a person walks into the excavator's swing radius while it is working",
    then: "The site manager is alerted in seconds; the day's safety log writes itself.",
    buyers: "Contractors, construction companies and project owners.",
    value: "Fewer near-misses, documented HSE work, safer sites.",
    senses: ["camera"],
    photo: "construction-safety",
    note: "Detects situations, not identities — no face recognition.",
    card: { meta: "Zone B · excavator 2", title: "Person inside swing radius" },
  },
  {
    id: "shooting-ranges",
    group: "people",
    name: "Shooting range safety",
    short: "Range flagging",
    line: "Scans every lane for a firearm pointed at other people — flagging — and for anyone forward of the firing line.",
    watches: "Muzzle direction on every lane, the firing line, people moving while the range is live.",
    alert: "a muzzle sweeps across another shooter, or someone steps forward while the range is hot",
    then: "The range officer is alerted instantly.",
    buyers: "Shooting clubs, indoor ranges and training ranges.",
    value: "An extra set of eyes on every lane, all the time.",
    senses: ["camera"],
    photo: "shooting-range",
    note: "Supports the range officer — never replaces range rules or supervision.",
    card: { meta: "Lane 6", title: "Muzzle across lane 5" },
  },
  {
    id: "ride-zones",
    group: "people",
    name: "Ride danger zones",
    short: "Ride zones",
    line: "Sees anyone outside the passenger area while a ride is moving.",
    watches: "The ride's danger zone, its gates and fences — and whether the ride is running.",
    alert: "a person is inside the fenced zone while the ride is active",
    then: "The operator is alerted at once, with the camera view.",
    buyers: "Amusement parks, fairground operators and family parks.",
    value: "Accidents prevented in the seconds that matter.",
    senses: ["camera"],
    photo: "ride-zones",
    note: "Alerts the operator. Linking to the ride's own safety controls needs the manufacturer's approval.",
    card: { meta: "Ride 4 · gate C", title: "Person in zone — ride running" },
  },
  {
    id: "trampoline-parks",
    group: "people",
    name: "Trampoline parks",
    short: "Trampoline parks",
    line: "Keeps an eye on every bed — someone under a trampoline, a jumper who doesn't get up, too many on one bed.",
    watches: "The space under and between the beds, jumpers lying still, how many are on each bed.",
    alert: "someone crawls under a trampoline, or a jumper lies still for more than 10 seconds",
    buyers: "Trampoline parks and activity centers.",
    value: "Staff see a problem the moment it happens — on every bed at once.",
    senses: ["camera"],
    photo: "trampoline-parks",
    card: { meta: "Court 3 · bed 7", title: "Person under the bed" },
  },
  {
    id: "falls",
    group: "people",
    name: "Falls in care and at home",
    short: "Fall alerts",
    line: "Detects a fall, or someone who doesn't get up, and alerts staff or family within seconds.",
    watches: "Movement in the room — a fall, no movement after a fall, a night-time walk that doesn't end.",
    alert: "a resident falls, or has not got up within 2 minutes",
    then: "The alert reaches the night nurse's phone. By default only the event is shared — not the video.",
    buyers: "Care homes, home-care services, assisted living and families.",
    value: "Help in minutes, not hours.",
    senses: ["camera", "sensor"],
    photo: "fall-detection",
    note: "Privacy first: events, not video, by default.",
    card: { meta: "Room 214 · 02:47", title: "Fall detected — nurse alerted" },
  },

  // ── 05 Water at night ───────────────────────────────────────────────────
  {
    id: "marinas",
    group: "night",
    name: "Marinas & harbors",
    short: "Marinas",
    line: "Sees a person fall from the dock, people on the docks after closing, and someone standing still too long at the water's edge.",
    watches: "Docks, gangways and the water between the boats — in thermal after dark.",
    alert: "a person goes into the water, or someone is on the docks after 23:00",
    then: "Harbor staff or the guard on call get the exact spot.",
    buyers: "Private marinas, yacht clubs, resorts and harbor operators.",
    value: "When someone falls in at night, minutes decide.",
    senses: ["camera", "thermal"],
    photo: "marinas",
    flagship: true,
    card: { meta: "Dock C · 01:32", title: "Person in the water" },
  },
  {
    id: "ferry-quays",
    group: "night",
    name: "Ferry quays at night",
    short: "Ferry quays",
    line: "Constant watch over unmanned car ferries and ferry quays when nobody is on duty.",
    watches: "Ramps, quay edges, waiting lanes, closed areas and the water.",
    alert: "a person or vehicle is on the ramp outside crossing times, or someone is in the water",
    buyers: "Ferry operators, road authorities and port owners.",
    value: "Safer unmanned operation, around the clock.",
    senses: ["camera", "thermal"],
    photo: "ferry-docks",
    card: { meta: "Quay 2 · ramp", title: "Person on the ramp — 03:15" },
  },
  {
    id: "pools",
    group: "night",
    name: "Hotel pools after closing",
    short: "Pools after hours",
    line: "Tells the night desk the moment someone enters the pool area — or the water — after closing.",
    watches: "The pool area and the water after hours.",
    alert: "anyone is in the water after 22:00",
    then: "Reception or security get the alert and a live view.",
    buyers: "Hotels, resorts, spas, holiday parks and housing associations with a pool.",
    value: "Night swimming is when people drown unseen.",
    senses: ["camera", "thermal"],
    photo: "pool-night",
    note: "Supports lifeguards during opening hours — never replaces them.",
    card: { meta: "Pool · 23:41", title: "Person in the water after closing" },
  },

  // ── 06 Farms & animals ──────────────────────────────────────────────────
  {
    id: "barns",
    group: "farms",
    name: "Barn behavior",
    short: "Barn behavior",
    line: "Measures activity, how the animals spread out and unusual changes at group level — and warns if an animal may have died.",
    watches: "Activity level, distribution across the house, clustering, animals that stop moving.",
    alert: "the flock avoids one zone for 30 minutes, or an animal has not moved for 4 hours",
    then: "The farmer gets the zone and the picture — at 3 a.m. if needed.",
    buyers: "Poultry producers and larger livestock farms.",
    value: "Earlier signs of problems with ventilation, water, feed or health.",
    senses: ["camera", "thermal"],
    photo: "livestock-barns",
    note: "Biological signals are checked and interpreted by the farm's responsible staff.",
    card: { meta: "House 2 · zone 4", title: "Activity far below normal" },
  },
  {
    id: "predators",
    group: "farms",
    name: "Predator warning",
    short: "Predator warning",
    line: "Thermal and normal cameras at the edge of the pasture spot wolves, bears, lynx and wolverines — day and night.",
    watches: "Fence lines, the forest edge and the ground around the flock.",
    alert: "a large predator crosses into the pasture at 03:12",
    then: "The farmer gets a text with the picture; lights or sound can be switched on to scare it off.",
    buyers: "Sheep and cattle farmers and grazing associations.",
    value: "Time to act before an attack — and pictures that document what happened.",
    senses: ["camera", "thermal"],
    photo: "predator-animal",
    card: { meta: "North pasture · 03:12", title: "Lynx near the flock" },
  },

  // ── 07 Operations & retail ──────────────────────────────────────────────
  {
    id: "truck-waiting",
    group: "operations",
    name: "Truck waiting times",
    short: "Truck waiting",
    line: "Records how long every truck waits at the gate, in the queue and at loading — and compares it by carrier, time and job.",
    watches: "The gate, the queue lanes and the loading bays.",
    alert: "a truck has queued for more than 45 minutes, or one carrier waits twice as long as the rest",
    then: "Weekly reports show where the time goes, so arrivals and slots can be planned.",
    buyers: "Port terminals, grain receiving, wholesalers and industrial sites.",
    value: "Fewer delays and better-planned arrivals.",
    senses: ["camera"],
    photo: "truck-waiting",
    card: { meta: "Gate 2 · queue", title: "Waiting 52 min — above target" },
  },
  {
    id: "equipment-yards",
    group: "operations",
    name: "Equipment rental yards",
    short: "Equipment yards",
    line: "Watches large outdoor machine parks — high-value equipment, around the clock.",
    watches: "Machines, gates, fuel tanks and anyone in the yard after hours — and each machine's condition at check-out and return.",
    alert: "a machine moves after 22:00, or someone enters the yard at night",
    then: "The guard or owner is alerted with the picture; check-out photos settle damage disputes.",
    buyers: "Machine rental companies, contractors' depots and equipment dealers.",
    value: "Less theft and fewer disputes over equipment worth millions.",
    senses: ["camera", "thermal"],
    photo: "rental-yards",
    card: { meta: "North yard · 02:20", title: "Excavator moving after hours" },
  },
  {
    id: "mall-statistics",
    group: "operations",
    name: "Shopping center statistics",
    short: "Mall statistics",
    line: "Anonymous counts, flows and dwell times — where people go, how long they stay, what they walk past.",
    watches: "Entrances, walkways, zones and queues — counted, never identified.",
    alert: "a zone's footfall or dwell time changes sharply from its normal week",
    then: "Use it for leasing, tenant mix, opening hours, staffing and campaigns.",
    buyers: "Shopping center owners and operators, and large retailers.",
    value: "Decisions based on how people actually use the center.",
    senses: ["camera"],
    photo: "mall-flows",
    note: "No faces, no identities, no tracking across visits.",
    card: { meta: "Level 1 · food court", title: "Saturday dwell time up sharply" },
  },
  {
    id: "self-checkout",
    group: "operations",
    name: "Self-checkout loss",
    short: "Self-checkout",
    line: "Notices items that go into the bag without being scanned — and lets staff do a friendly check.",
    watches: "The scanner, the bagging area and the basket at each checkout.",
    alert: "an item goes into the bag without a scan",
    then: "A staff member gets a discreet notice for that checkout.",
    buyers: "Grocery chains and retailers with self-checkout.",
    value: "Less loss without more staff at the checkouts.",
    senses: ["camera"],
    photo: "self-checkout",
    note: "Looks at items, not faces — no face recognition.",
    card: { meta: "Checkout 4", title: "Item bagged — not scanned" },
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
  tagline: "Custom AI monitoring on cameras and sensors — for the places nobody watches.",
  markets: "Europe · North America",
  photo: "cover-b",
  card: { meta: "Substation inlet · 02:14", title: "Heat building at one clamp" },
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
  { n: 0, name: "Physical", line: "The site as it is — machines, stations, docks, barns.", short: "The site as it is." },
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
  text: "We build a custom AI monitor for each problem — on the customer's cameras where they can see enough, with new cameras or sensors where they can't.",
  photo: "pump-stations",
  alert: { meta: "Station 3 · pump 2", title: "Water on the floor — spreading" },
};

export const FOCUS = {
  title: "Niche on purpose.",
  text: "Each service solves one specific, costly problem that cameras and AI can already handle — but that nobody has packaged. Generic video analytics leaves them alone. That's where we go.",
};

export const FLAGSHIP = {
  kicker: "Where we start",
  title: "Old equipment online — at about 1/25 of the price.",
  text: "Most sites run on equipment that was never connected. Replacing the control system means new panels, rewiring and downtime. We point a camera at what's already there.",
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
  photo: "legacy-room",
  card: { meta: "Generator 3 · read every minute", title: "42 MW — normal", kind: "reading" as const },
};

export const DEPLOY = {
  title: "On what's there — or with what's missing.",
  text: "Every project mixes three ways in. We only add hardware where the problem needs it.",
  paths: [
    {
      title: "Existing cameras",
      text: "Many sites can start with the cameras they already have — software only.",
      photo: "existing-camera",
    },
    {
      title: "Camera on old equipment",
      text: "A camera in front of a panel, a sensor on a motor. Nothing opened, nothing rewired.",
      photo: "legacy-panels",
    },
    {
      title: "New hardware, remote sites",
      text: "Thermal cameras, sensors and a 4G/5G gateway — on mains or solar power, where there is no network at all.",
      photo: "remote-site",
    },
  ],
  steps: [
    { title: "Scope", text: "One problem at one site. A few camera stills, and what an alert should mean." },
    { title: "Pilot", text: "A few weeks on one site, tuned with the people who will get the alerts." },
    { title: "Roll out", text: "More cameras, more sites — on the same layer." },
    { title: "Run", text: "We watch the models and keep improving them." },
  ],
  where: "Analysis runs on site, in the cloud, or split between them.",
};

export const TRUST = {
  title: "Private by design.",
  text: "Several services watch places where people are. They are built for European privacy rules from the start.",
  points: [
    { title: "Situations, not identities", text: "We detect events — a fall, a hot bearing, a person in a danger zone. No face recognition." },
    { title: "Data stays where it should", text: "Analysis can run on site, so only the event and a snapshot leave it." },
    { title: "People decide", text: "Every alert goes to a person who decides what to do next." },
    { title: "An extra layer, not a replacement", text: "We add to certified safety systems, lifeguards and inspections — never replace them." },
  ],
};

export const MARKET = {
  title: "Europe and North America.",
  text: "The same problems exist wherever there are old stations, unmanned sites and expensive equipment.",
  why: [
    { title: "Cameras are everywhere", text: "Most sites already have cameras that nobody watches." },
    { title: "Sensors are cheap", text: "Thermal cameras and vibration sensors cost a fraction of what they used to." },
    { title: "AI runs on site", text: "Models now run on a small box on site, so video doesn't have to leave the site." },
    { title: "Old infrastructure stays", text: "It isn't being replaced fast enough — but it can be read." },
  ],
  buyers: [
    "Municipal water & wastewater",
    "Waterworks",
    "Grid operators",
    "Process industry",
    "Manufacturers",
    "Construction",
    "Waste & recycling",
    "Ports & terminals",
    "Offshore & heavy lift",
    "Machine rental",
    "Poultry & livestock",
    "Sheep farmers",
    "Shopping centers",
    "Grocery retail",
    "Hotels & resorts",
    "Marinas & yacht clubs",
    "Ferry operators",
    "Amusement & trampoline parks",
    "Shooting ranges",
    "Care homes & home care",
    "Road authorities",
    "Parking operators",
  ],
};

export const CONTACT = {
  title: "Let's find the first site.",
  text: "Tell us about one problem at one site. We'll tell you what a camera could catch — and what it would take.",
  fine: "Photographs are openly licensed pictures of real places, used as illustrations — not Enlight Layer sites or customers. Alerts shown are examples.",
};
