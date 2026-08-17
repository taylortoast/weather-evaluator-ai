# BLK-1-Unit-4-Obj-4c-PIREPS-and-TAFS

Source: BLK-1-Unit-4-Obj-4c-PIREPS-and-TAFS.pdf

## Page 1

UNIT 4: Weather Analysis Products
c. Pilot Reports & Terminal Aerodrome Forecasts
the title slide of 4c needs to have TAFs added
Introduction to Pilot Reports (PIREPS) & Terminal Aerodrome
Forecasts (TAFs)
PIREPS are used to record and report in- flight weather occurrences. PIREP data may be
obtained from a pilot either in the air or on the ground, or from a reliable source on the ground.
TAFs are used to provide a forecast for the most probable weather elements expected during the
forecast period for a specific location. Operationally, time periods vary between the services.
Air Force units issue a 30-hour forecasts while Navy and Marine Corps units issue a 24-hour
forecasts. The forecast location is a five-statute mile radius extending outward from each
location.
1

## Page 2

The goal of this objective will be to show you have the capability to decode PIREPS and TAFS.
To successfully demonstrate competency on this topic, you will be given information through
lecture, a series of questions and tasks designed to display your ability to correctly interpret
encoded weather data discussed throughout this objective. These foundational analysis concepts
will be measured with a Progress Check (PC) at the end of the objective and must be passed to
continue onto the next objective. Follow your instructor’s guidance as they provide information
and instruction for completing all requirements necessary to pass this objective.
INPUT PIREP/TAF SOPS HERE
Reference Manual
Like the publication containing all information and guidance concerning surface weather
observations, a manual also exists outlining how to properly Decode PIREPS and TAFs. For this
course, all branches will use the air force publication AFMAN 15-124 for guidance on PIREPS
and TAFs.
Exercise / Practice: Navigating the Manual
Decoding PIREPS
Each PIREP must contain:
• Message Type
• Location
• Time
• Flight Level
• Type of Aircraft
• At least one other element to include either sky cover, present weather, temperature, flight
level, wind direction and speed, turbulence, or icing.
2

## Page 3

Station Identifier
The airfield identifier of the unit transmitting the pilot's observation. This identifier will be the
same as the identifier used in that station’s observations.
Message Type
There are two message types: UA (routine report) or UUA (urgent) report.
Location
The point (/OV) where a pilot observed weather phenomena. It has different formats. For single
location reports, the location can be an airport identifier to include during climb (DURC) away
from the airfield or during descent (DURD) to the airfield. It can also be a latitude/longitude
coordinate such as 2139N 06525W. Pilots can also report weather between two locations using
airfield identifiers, latitude/longitude coordinates, or a combination of both.
Time
The UTC time (/TM) pilot observed the weather phenomena.
Flight level
The aircraft's altitude (/FL) in hundreds of feet is like METAR cloud heights. Decode
/FLUNKN as flight level unknown.
Type of aircraft
Read the aircraft type (/TP) without any modification.
Sky cover
The sky cover (/SC) at the pilot’s flight level. Each layer has an amount as well as its base and
top in hundreds of feet, if known. Overcast layers may have an unknown base or top.
Weather
The weather (/WX) group contains the flight visibility (FV) indicator, visibility in two digits, its
units of measure, and any weather phenomenon. Decode visibility in whole miles with two
exceptions, unrestricted visibility (99) and visibility less than 1/2 mile (00).
The units of measure may be statute miles or kilometers. If statute miles, SM will follow the
visibility values. There is no indicator for kilometers which are normally only at non-United
States locations overseas.
Temperature
Decode temperature (/TA) in whole degrees Celsius. If the letter M precedes the temperature,
decode it as a negative number.
Winds
The wind (/WV) group has six digits. The first three are direction and the last three are the
speed.
3

## Page 4

Turbulence
The turbulence (/TB) group has four parts: duration, intensity, type, and altitude. The three
durations, four intensities, and two types combine to describe a multitude of turbulence
scenarios. For example, INTMT LGT CHOP is intermittent light chop turbulence and MOD
OCNL SEV CAT indicates moderate occasional severe clear air turbulence.
Duration:
• OCNL – Occasional
• INTMT – Intermittent
• CONS – Continuous
Intensity:
• LGT – Light
• MOD – Moderate
• SEV – Severe
• EXTRM – Extreme
Type:
• CAT – Clear Air Turbulence
• CHOP - Chop
Altitude has three formats, and you decode each one differently. First, when the PIREP has
turbulence without an altitude, the turbulence is at the aircraft's flight level. Second, it may have
the base and top of turbulence depicted in hundreds of feet using three digits. Third, the
contractions ABV (above) or BLO (below) may be included with one altitude. For example:
• /TB INTMT MOD = Intermittent moderate turbulence at flight level.
• /TB LGT CHOP 030-050 = light chop turbulence between 3,000 and 5,000 feet.
• /TB LGT-MOD BLO 080 = Light to moderate turbulence below 8,000 feet.
The last turbulence entry is NEG, meaning the aircraft is in a forecast area of turbulence, but it
did not experience any turbulence.
Icing
The icing (/IC) group has four intensities and three types. Decode icing the same as the
turbulence group to include “NEG” icing.
Intensity:
• TRACE – Trace (amount too minimal to be properly identified)
• LGT - Light
• MOD - Moderate
• SEV – Severe
Type:
• RIME - Rime
• CLR - Clear
• MXD – Mixed
Exercise / Practice: Decoding PIREPS
4

## Page 5

Decoding TAFs
The TAF will show weather elements onset, duration, and intensity throughout the forecast
period. TAF code nearly mirrors the METAR code with some exceptions. All TAFs will have
weather elements in the following order from beginning to end:
• Valid time
• Winds
• Visibility
• Present weather
• Sky condition
• Wind Shear
• Icing
• Turbulence
• Pressure
Structure
A TAF may be multiple lines, or a single line forecast that includes all the elements above. A
single line TAF typically occurs when the air mass does not change so individual elements do
not change or cross specification criteria throughout the duration of the forecast period.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Issue and Valid Times
The TAFs issue time tells when the TAF was submitted. The issue time tells the day, hour, and
minute the TAF was issued. The valid time tells you the starting time the TAF is forecasting for
and the end of the forecast.
All times are encoded using Coordinated Universal Time (UTC) in day, hours, and minutes
followed by the letter Z. All valid periods consist of a beginning time and ending time in whole
hours. For example, 1420/1520Z is a valid period beginning on the 14
th at 2000Z through the
15th at 2000Z.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
5

## Page 6

Change Groups
The three change groups are becoming (BECMG), temporary (TEMPO), and from (FM). They
show changes from the predominant forecast condition at a specified period.
Becoming (BECMG): This is a predominate change in one or more weather elements. The
change typically occurs over a one-hour period. It is the primary forecast change group for the
Air Force. It includes all weather elements required in the TAF whether they are changing or not.
Navy and Marine Corps TAFs only have the changing element or elements. A BECMG group
has a two-digit date with beginning and ending times in whole hours. The elements become the
predominant condition after the end time.
From (FM): This is also a predominate change group. It is the primary forecast group for Navy
and Marine Corps TAFs. FM groups specify the date, hour, and minutes for the change.
021420Z indicates a change on the 2
nd at 1420Z.
Temporary (TEMPO): TEMPO groups list elements that fluctuate between specific criteria
thresholds. The key to TEMPO groups is the elements listed NEVER become the predominate
weather condition. TEMPO group times are bound by the fluctuating weather element(s). The
beginning time fluctuations begin to the time the fluctuations end. It has the same format as the
TAF valid time.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Wind Group
The prevailing wind direction is encoded in three digits to nearest 10 degrees and the speed in
two or three digits to the nearest whole knot. Wind gusts will be encoded the same as METAR
code.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Visibility, Weather, and Obscuration Group
Visibility is encoded in meters using the METAR observation code’s reportable values. Anytime
the visibility is below 9999 meters the TAF must include a restrictor to visibility. Precipitation
and obscurations to vision use the same coding rules as METAR code. Only one group is normal
in a TAF, but multiple groups are possible. No significant weather (NSW) is unique to the TAF
6

## Page 7

code. It signifies the end of a restricting element to include any feature in the vicinity. Either the
restrictor stopped, or it moved away from the forecast location.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Sky Condition Group
Sky Condition is encoded in the same format as METAR code. All forecast cloud layers will be
arranged from the lowest to the highest cloud up to the first overcast layer. The only cloud type
appended to a cloud group is cumulonimbus (CB).
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Low-Level Wind Shear
Wind shear is the change in wind speed and/or direction between surface and 2,000 ft AGL.
While some degree of wind shear is almost always present in the atmosphere, strong wind shear
can pose a significant hazard to aviation and influence severe weather. Wind shear is encoded in
hundreds of feet with the wind direction and speed above the shear height. For example, you
encode WS015/12038KT for LLWS at 1,500 feet with winds from 120 degrees at 38 knots above
1,500 feet.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Turbulence
Air Force TAFs only encode turbulence between the surface and 10,000 feet (AGL) while Navy
and Marine Corps TAFs encode turbulence for all levels between the surface and tropopause.
The turbulence group has six digits. The first digit is the group indicator (5) and the second digit
is a coded figure for turbulence intensity. The third through fifth digits are the base height of the
turbulence layer in hundreds of feet and the sixth digit is the thickness of the layer in thousands
of feet.
7

## Page 8

TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Icing
Icing is only included if it is not associated with thunderstorms. Air Force TAFs only encode
icing between the surface and 10,000 feet (AGL) while Navy and Marine Corps TAFs encode
icing for all levels between the surface and tropopause. The icing group has six digits. The first
digit is the group indicator (6), and the second digit is a coded figure for the icing intensity and
type. The third through fifth digits are the base height of the icing layer in hundreds of feet and
the sixth digit is the thickness of the layer in thousands of feet.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Altimeter Setting Group
The altimeter setting (ALSTG) is encoded in inches of mercury. For a single line TAF, the
ALSTG will be the lowest expected value for the entire forecast period. Multiple line TAFs
encode the lowest ALSTG for the valid time of each predominate group. The group format
begins with its indicator (QNH) followed by the lowest ALSTG in four digits without a decimal
point then concludes with “INS” for inches of Mercury.
TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Maximum and Minimum Temperature
Maximum and minimum temperatures are encoded in the last line of the TAF. This remark is to
display the forecasted date/time of the maximum and minimum temperatures for ONLY the first
24-hours of the TAF. Its format includes two temperature indicators: TX for the maximum
temperature and TN for the minimum temperature. Temperatures are two digits in whole degrees
Celsius and preceded with the letter “M” for negative temperatures. Following each temperature
is the two-digit date and time to nearest whole hour followed with the letter “Z”.
8

## Page 9

TAF KBIX 291200Z 2912/3018 13010KT 9999 SCT040 BKN080 WS020/22035KT
QNH2998INS
TEMPO 2918/2922 24025G35KT 6000 TSRA SCT015 BKN030CB
BECMG 3001/3002 27015KT 9999 NSW BKN015 OVC025 520306 620406 QNH2982INS
BECMG 3013/3014 32020KT 9999 OVC015 620306 QNH2965INS
TX22/2919Z TN13/3009Z
Exercise / Practice: Decoding TAFSs
Practice: PIREPS & TAFS
PC: Decoding PIREPS & TAFs
9
