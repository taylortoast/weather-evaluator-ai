# AFMAN-15-124-Obj-6a

Source: AFMAN-15-124-Obj-6a.pdf

## Page 1

6 AFMAN15-124 16 JANUARY 2019
Chapter 1
AIR FORCE TERMINAL AERODROME FORECAST (TAF) CODE
1.1. Roles and Responsibilities. The procedures in this manual apply to all AF Weather
organizations or associated contractors performing forecasting of weather and solar operations in
support of AF, Army or DoD wide operations . Compliance items for this publication are driven
by international policy to ensure safety of aviation. This chapter gives instructions for encoding
Terminal Aerodrome Forecasts (TAFs). Air Force weather organizations specify, amend, and
disseminate TAF s in accordance with AFI 15 -128, Weather Roles and Responsibilities and
AFMAN 15-129 Volume 1, Air and Space Weather Operations – Characterization.
1.2. Code Format. Air Force weather forecast coding practices are derived from international
standards established by the World Meteorological Organization (WMO) as published in WMO
No. 306, Manual on Codes, Volume I.1, Part A, Section FM 51, Aerodrome Forecast, and aligns
with practices of the Aviation Routine Weather Report (METAR) code found in AFMAN 15-111,
Surface Weather Observations.
1.2.1. Unless otherwise specified, forecast elements in the main body of the forecast text
(clouds, weather, wind, etc.) apply to the area at or within a 5 statute mile radius of the center
of the aerodrome. Specified weather greater than 5 statute miles but less than or equal to 10
statute miles of the aerodrome center is encoded as VC (in the vicinity). (T-0) Do not specify
elements outside of the “vicinity” in forecasts.
1.2.2. Forecast elements represent the expected condition during the forecast period and in the
forecast area.
1.3. TAF Encoding.
1.3.1. TAF Code Format. Use the following format in Figure 1.1 for encoding TAFs:
Figure 1.1. TAF Code Format.
MESSAGE HEADING
TAF (AMD or COR) CCCC YYGGggZ YYG1G1/YYG2G2 dddffGfmfmKT VVVV
w’w’ NsNsNshshshsCC or VVhshshs or SKC (VAbbbttt) (WShxhxhx/dddfffKT)
(6IchihihitL) (5BhBhBhBtL) QNHP1P1P1P1INS (Remarks)
TTTTT YYGGGeGe or YYGG/YYGeGe ddffGfmfmKT…same as above… (Remarks)
TX(M)TFTF/YYGFGFZ TN(M)TFTF/YYGFGFZ
1.3.1.1. Make all TAFs valid for a 30-hour forecast period.
1.3.1.2. Use groups in parentheses only as condition exists or as required.
1.3.2. Specification of Symbolic Letters.
1.3.2.1. Message Heading (TAF [AMD or COR] CCCC YYGGggZ YYG1G1/YYG2G2).
The message heading consists of:
1.3.2.1.1. Message identifier of TAF
1.3.2.1.2. Forecast modifier indicating an amendment or correction (AMD or COR).
Only one modifier at a time.

## Page 2

AFMAN15-124 16 JANUARY 2019 7
1.3.2.1.2.1. When issuing an amendment (AMD), issue only the remaining valid
period of the TAF (e.g. If a TAF originally starting at 1600Z is amended at 1847Z,
only forecast groups valid at and after 1800Z are included; groups that are no longer
valid are removed).
1.3.2.1.2.2. When issuing a correction (COR), issue the entire original text of the
TAF, changing only the TAF header and the erroneous elements (e.g., if a TAF
originally starting at 1600Z is correct ed at 1615Z, all forecast groups remain
included). See Figure 1.4 for an example TAF correction.
1.3.2.1.3. Four Letter Location identifier (CCCC)
1.3.2.1.4. Issue Date and Time, YYGGggZ. The issue date and time cons ists of the
current day of the month (YY) and the Coordinated Universal Time (UTC) in hours
(GG) and minutes (gg) followed by the letter Z. This time is updated for each change
to a TAF (i.e. a new TAF, amendments, and/or corrections).
1.3.2.1.5. Valid Period (YYG1G1/YYG2G2). The valid period consists of the current
day of the month (YY) and the 30 -hour period of the forecast beginning time (G1G1)
and ending time (G2G2) in whole hours, except for amended TAFs. All times are in
UTC. For TAF groups start ing and stopping at midnight UTC, use 00 and 24,
respectively, to indicate the appropriate valid times. Amended TAFs are valid from the
current hour to the ending hour of the original TAF. For example, if the current time
is 1640Z, the amended time would be 16Z; if the current time is 2110Z, the amended
time would be 21Z. For example, amending the 0318/0424Z TAF at 2131Z, the valid
period is 0321/0424Z.
1.3.3. Change Groups (TTTTT). Use BECMG YYGG/YYGeGe, TEMPO YYGG/YYGeGe,
and FM YYGGgg change groups to indicate changes from the predominant forecast condition
at some intermediate date and hour time (YYGGgg) or during a specified period between hours
(YYGG to YYGeGe). TEMPO groups may be used to forecast a change in any or all forecast
groups and be followed by a description of all the elements for which a change is forecast to
occur intermittently from YYGG to YYGeGe. Exception: Non-convective low -level wind
shear and QNH groups are not included in TEMPO groups. FM change groups must include
all encoded elements. Start a new line of text for each change group. Change groups that begin
or end at midnight UTC will use 00 and 24 respectively to indicate the appropriate valid times.
Limit change groups to those that are significant to airfield operations. (T-0) Avoid
overlapping forecast periods in order to avoid confusion and keep the intent of the forecast
simple.
1.3.3.1. Becoming (BECMG)—The change-indicator group TTTTT YYGG/YYGeGe in
the form of BECMG YYGG/YYGeGe is used to indicate a change to foreca st prevailing
conditions expected to occur at either a regular or irregular rate at an unspecified time
within the period defined by a two-digit date (YY), two-digit change beginning time (GG)
with a slash separating a two-digit date (YY) and a two-digit ending time (GeGe) in whole
hours. The time -period described by a BECMG group is usually for one hour but never
exceeds two hours. This change to the predominant conditions are followed by a
description of all elements for which the change is forecast. T he forecast conditions
encoded after the BECMG YYGG/YYGeGe group are those elements expected to prevail
from the ending time of this change group (GeGe) to the ending time of the forecast period

## Page 3

8 AFMAN15-124 16 JANUARY 2019
(YYG2G2). The forecasted conditions must occur less than 30 minutes after the YYGeGe
group start time. (T-0) When using the BECMG group to forecast a change in one or more
elements, repeat the entire element(s). For example, if the BECMG group was used to
forecast a decrease in the ceiling and all other forecast layers were expected to remain the
same, the entire cloud code group is repeated, not just the ceiling layer.
1.3.3.2. Temporary (TEMPO)—The change-indicator group TTTTT YYGG/YYGeGe in
the form of TEMPO YYGG/YYGeGe group is used to indicate temporary fluctu ations to
the forecast meteorological conditions. Conditions described by the TEMPO group must
occur once during the specified time-period indicated by the date YY and time GG to the
date YY and time G eGe, for less than 30 consecutive minutes or occur for an aggregate
total of less than 30 minutes of every cardinal hour and cover less than half of the period
indicated by the date YY and time GG to the date YY and time GeGe. (T-1) Exception:
Organizations will allow 45 minutes for thunderstorms. (T-0) The extra 15 minutes
provide for the 15 -minute period between the time thunder is last heard and the time the
thunderstorm is officially ended. If forecast conditions in the TEMPO group last more than
30 consecutive minutes or are expected to last more than half of the period indicated by the
time YYGG to YYGeGe, then the temporary condition will be considered to be
predominant and entered in the initial forecast period or following a FMYYGGgg or
BECMG group. (T-0)
1.3.3.3. From (FMYYGGgg)—The time indicator YYGGgg in the form of FMYYGGgg
is used to indicate the beginning of a self -contained part of the forecast indicated by the
two-digit date YY and four -digit time GGgg. When the group FMYYGGgg is used, all
forecast conditions preceding this group are superseded by the conditions forecasted in this
group. For example, if the TAF period is 1909/2015 and a change is forecast at 1420 UTC,
the entry FM191420 shall be encoded. The elements entered on this line are in effect from
191420 UTC to the end of the forecast period, 201500 UTC. While the use of a four-digit
time in whole hours (e.g., 1600) remains acceptable, a forecast and amending events may
require a higher time resolution. Use forecast minutes in this case. Four -digit resolution
will only be used in this FMGGgg group. The forecasted conditions must occur in less
than 30 minutes from the time specified in the YYGGgg group. (T-0)
1.3.4. Wind Group (dddffGfmfmKT). Surface wind direction, speed and gusts, if any.
1.3.4.1. Wind direction (ddd). Forecast true wind direction (from which wind is blowing)
to the nearest 10 degrees. If direction varies more than 60 degrees, encode the prevailing
direction for ddd and append the limits of variability to remarks (e.g., WND 270V350).
Forecast a prevailing wind direction whenever it can be determined. In rare cases, there
may be situations when forecasting a prevailing direction is not possible. In these
situations, encode VRB for ddd.
1.3.4.1.1. When winds are calm, encode dddff as 00000KT.
1.3.4.1.2. When wind speed is 6 knots or less and a direction cannot be determined,
encode dddff as VRBff.

## Page 4

AFMAN15-124 16 JANUARY 2019 9
1.3.4.2. When wind speeds are be more than 6 knots, do not use VRB for ddd unless the
situation involves air -mass thunderstorm activity during which forecasting a prevailing
wind direction with confidence is not possible. When it is possible to forecast the peak
gust direction, but not the prevailing direction, encode the wind group as VRBffGfmfmKT
and append the probable peak gust direction to remarks (e.g., GST DRCTN 250).
1.3.4.2.1. Wind Speed (ff). Mean forecast wind speed in whole knots. When speed is
equal to or greater than 100 knots, use three digits.
1.3.4.2.2. Gusts (Gfmfm). Forecast speed or gusts, in whole knots. Encode gusts when
the maximum speed exceeds a mean speed (ff) by 10 knots or more or when the peak
wind speed is forecast to exceed the lull by 10 knots or more. Encode gusts of 100
knots or more in three digits. (T-0)
1.3.4.2.3. KT. Unit indicator for wind speeds in knots.
1.3.5. Visibility Group (VVVV). Forecast prevailing visibility in meters, rounded down to
the nearest reportable value from Table 1.1. Incl ude weather and/or an obscuration (w’w’)
whenever visibility is forecast less than 9,999 meters. (T-0) If visibility alternates frequently
from one significant value to another, describe the situation with a TEMPO group; do not use
variable visibility remarks. Note: While a visibility of less than 9,999 meters requires a weather
and/or obscuration, weather such as precipitation does not require a restriction to visibility to
be reported in a forecast (e.g., 9999 –RA). In this case, the weather is significant because it is
occurring, not because it is restricting visibility.

## Page 5

10 AFMAN15-124 16 JANUARY 2019
Table 1.1. Visibility (VVVV).
Statute Miles Meters Statute Miles Meters
0 0000 1 3/8 2,200
1/16 0100 1 1/2 2,400
1/8 0200 1 5/8 2,600
3/16 0300 1 3/4 2,800
1/4 0400 1 7/8 3,000
5/16 0500 2 3,200
3/8 0600 - 3,400
- 0700 2 1/4 3,600
1/2 0800 - 3,700
- 0900 2 1/2 4,000
5/8 1,000 2 3/4 4,400
- 1,100 - 4,500
3/4 1,200 - 4,700
- 1,300 3 4,800* See NOTE 1
7/8 1,400 - 5,000* See NOTE 1
- 1,500 4 6,000
1 1,600 - 7,000
- 1,700 5 8,000
1 1/8 1,800 6 9,000
1 1/4 2,000 7 and above 9,999
Note 1: Substitute 5000 meters for 4800 meters Outside the Continental
United States (OCONUS) locations based on the host-nation national
practice.
1.3.6. Forecast Weather and Obscuration Group (w’w’). AFMAN 15 -111 defines forecast
weather and obscurations for construction of w’w’ groups (Table 1.2).

## Page 6

AFMAN15-124 16 JANUARY 2019 11
Table 1.2. Weather (w’w’) Group Code.
QUALIFIER WEATHER PHENOMENA
INTENSITY
OR
PROXIMITY
DESCRIPTOR PRECIPITATION OBSCURATIO
N
OTHER
1 2 3 4 5
- Light
Moderate
+ Heavy
(well-developed
in the case of
tornadoes or
waterspouts)
VC In the
Vicinity
MI Shallow
PR Partial
(covering part of
the aerodrome)
BC Patches
DR Low
Drifting
BL Blowing
SH Shower(s)
TS
Thunderstorm
FZ Freezing
(Super-cooled)
DZ Drizzle
RA Rain
SN Snow
SG Snow Grains
IC Ice Crystals
(Diamond Dust)
PL Ice Pellets
GR Hail
GS Snow Pellets
BR Mist
FG Fog
FU Smoke
VA Volcanic
Ash
DU Widespread
Dust
SA Sand
HZ Haze
PY Spray
PO Well-
developed
Dust/Sand
Whirls
SQ Squalls
FC Funnel
cloud(s)
(Tornado or
Waterspout)
SS Sand
storm
DS Dust
storm
1.3.6.1. Construct predominant forecast weather (w’w’) groups by considering Table 1.2,
columns one to five in sequence. That is intensity/proximity, followed by description,
followed by precipitation type (two precipitation types can be used in the same w’w’
group), obscuration, or other weather phenomena (e.g., +SHRA is heavy showers of rain,
+TSRAGR is thunderstorms, heavy rain, and hail; -RASN is light rain and snow; TS is
thunderstorm without precipitation).
1.3.6.2. Only one w’w’ group is normally included unless one group does not adequat ely
describe the forecast situation. When more than one weather or obscuration condition
exists, limit the w’w’ group to three groups. When more than three w’w’ groups apply to
a situation, select and encode the three w’w’ that are most significant to operations.
1.3.6.3. When applicable, funnel clouds (FC) and tornadoes (+FC) take precedence over
all other w’w’ groups and are forecast as at the station and not in the vicinity.
1.3.6.4. VC may be encoded in combination with thunderstorms (TS), showers ( SH), fog
(FG), blowing snow (BLSN), blowing dust (BLDU), blowing sand (BLSA), well -
developed dust/sand whirls (PO), sand storm (SS), and dust storm (DS). When encoding,
place VC before the precipitation, obscuration, or other weather phenomena entry without

## Page 7

12 AFMAN15-124 16 JANUARY 2019
a space between the two (e.g., VCSH, VCPO). Do not encode intensity qualifiers with VC.
Forecast weather in the vicinity is the last entry in the weather (w’w’) group.
1.3.6.5. When an encoded predominant forecast condition is followed by a change gr oup
(BECMG or FM) without a w’w’ group, encode the change group w’w’ as NSW (no
significant weather) to indicate that significant weather is no longer expected. This
includes weather forecast in the vicinity (e.g., VCSH was included in a previous group,
and forecasted to end).
1.3.6.6. Forecast Volcanic Ash (VA) as present weather regardless of restrictions to
visibility when VA is observed (T-0) or the Volcanic Ash Advisory Center (VAAC)
forecast includes a surfaced-based VA plume. (T-1)
1.3.6.7. Forecast Squall (SQ) when a strong wind characterized by a sudden onset in which
the wind speed increases at least 16 knots and sustained at 22 knots or more for at least one
minute.
1.3.7. Cloud and Obscuration Group (NsNsNshshshsCC). Report as often as neces sary to
indicate all forecast cloud layers up to the first overcast layer. Arrange groups in ascending
order of cloud bases AGL (e.g., lowest base first). (T-0)
1.3.7.1. Cloud Amount (NsNsNs). The cloud amount is given as sky clear (SKC = no
clouds); few (FEW = trace to 2/8ths); scattered (SCT = 3/8ths to 4/8ths); broken (BKN =
5/8ths to 7/8ths); or overcast (OVC = 8/8ths). Follow the three -letter abbreviations with
the height of the base of the cloud layer (mass) hshshs without a space (e.g., FEW100,
SCT250). The summation principle applies. This principle states that the sky cover at any
level is equal to the summation of the sky cover of the lowest layer, plus the additional sky
cover at all successively higher layers, up to and including, the layer being considered. Do
not assign a sky cover to a layer less than a lower layer (e.g., SCT015 FEW020 should be
SCT015 BKN020).
1.3.7.2. When the sky is totally obscured, encode VVhshshs, where VV is the indicator
and hshshs is the vertical visibility in hundreds of feet (e.g. VV002).
1.3.7.3. Ceiling Height (hshshs). A ceiling is the height above the earth’s surface of the
lowest layer reported as broken or overcast; or the vertical visibility into an indefinite
ceiling. Consider all layers and obscuring phenomena to be opaque.
1.3.7.4. Indefinite Ceiling (VVhshshs). The vertical visibility measured in feet, into a
surface-based total obscuration, which hides the entire celestial dome (8/8ths).
1.3.7.5. Surface-Based Partial Obscuration. When forecasting a surface -based partial
obscuration, encode as FEW000, SCT000, or BKN000 as appropriate to indicate a surface-
based partial obscuration. Code as a remark the obscuring phenomena and the applicable
layer. For example, FG SCT000 would indicate the w’w’ weather element causing the
obscuration is caused by fog and layer amount is SCT. Include the amount of partial
obscuration in your sky cover summation computation. Do not consider surface -based
partial obscurations as a ceiling.
1.3.7.6. Variable Sky Condition. If two or more significant sky conditions alternate
frequently from one to the other, describe the situation with a TEMPO group; do not use
variable sky condition remarks.

## Page 8

AFMAN15-124 16 JANUARY 2019 13
1.3.7.7. Height of Cloud Base (hshshs). Forecast the height of t he base of each sky cover
layer in hundreds of feet AGL using the reportable layers defined in Table 1.3.
Table 1.3. Reportable Cloud Layers.
Range of Height Values (feet) Reportable Increments (feet)
< 50 feet Round down to 000 feet
> 50 feet but < 5,000 feet To the nearest 100 feet
> 5,000 feet but < 10,000 feet To the nearest 500 feet
> 10,000 feet To the nearest 1,000 feet
1.3.7.8. Cloud Type (CC). The only cloud type included in the aerodrome forecast is
cumulonimbus (CB); when appropriate, the contraction CB follows cloud or obscuration
height (hshsh) without a space. (T-0). The cloud or obscuration group will include a
forecast cloud type of cumulonimbus (CB) whenever a thunderstorm is included in th e
significant weather group. This includes forecasts for thunderstorms in the vicinity (i.e.,
VCTS). (T-0) The following example shows the use of the CB contraction:
Figure 1.2. TAF Example Using CB Contraction.
TAF CCCC 101555Z 1016/1122 24025G35KT 0800 TSRA BKN035CB OVC080
QNH2978INS
BECMG 1017/1018 27010G15KT 9999 VCTS FEW040CB SCT080 QNH2989INS
BECMG 1019/1020 31012KT 9999 NSW SCT080 QNH2995INS TX14/1022Z
TN09/1113Z
1.3.8. Example TAF. Figure 1.3 provides an exa mple TAF for Barksdale AFB, LA.
Interpretation and explanations of the coded information follows.
Figure 1.3. TAF Example.
TAF KBAD 011555Z 0116/0222 03008KT 0800 PRFG FEW000 BKN005 BKN012
QNH3001INS FG FEW000
TEMPO 0118/0121 14012G18KT 3200 -SHSN BLSN FEW000 OVC006 620065 BLSN
FEW000
FM012145 15012G20KT 9999 NSW OVC030 QNH2992INS
BECMG 0123/0124 15012G20KT 3200 -SN BLSN FEW000 OVC004 620046
QNH2983INS BLSN FEW000
TEMPO 0201/0203 13015G25KT 0200 -FZDZ FG VV001 660001 650109 TX00/0121Z
TNM01/0212Z
1.3.8.1. The forecast is for Barksdale AFB, LA (KBAD), issued on the first at 1555Z, valid
from 011600Z to 022200Z. The initial conditions (1600Z to 2144Z) are for winds from
030 degrees at 8 knots, visibility 800 meters in partial fog; sky cover is few (either a
surface-based partial obscuration or a layer at or lower than 50 feet), sky is broken (ceiling)
at 500 feet and broken at 1200 feet. The lowest altimeter setting between 011600Z and
012144Z is 30.01 in ches of mercury. There is a fog -induced surface -based partial
obscuration from 1/8 to 2/8 coverage.

## Page 9

14 AFMAN15-124 16 JANUARY 2019
1.3.8.1.1. Between 011800Z and 012100Z, conditions vary temporarily to winds from
140 degrees at 12 knots gusting to 18 knots, visibility 3200 meters in light snow
showers and blowing snow, sky cover is few at the surface (surface -based partial
obscuration), overcast at 600 feet (the ceiling), with light rime icing from 600 to 5600
feet above ground level (AGL). The surface -based partial obscuration (FEW0 00) is
caused by blowing snow.
1.3.8.1.2. Beginning at 012145Z, conditions change to wind from 150 degrees at 12
knots gusting to 20 knots; unrestricted visibility 9,999 meters or greater, no significant
weather, sky cover overcast at 3000 feet and the lowest altimeter setting from
012145Z until 012400Z is 29.92 inches of mercury.
1.3.8.1.3. Between 012300Z and 012400Z, conditions become: wind from 150 degrees
at 12 knots gusting to 20 knots; visibility 3200 meters in light snow and blowing snow,
sky cover is few (either a surface -based partial obscuration or a layer at or lower than
50 feet), sky has an overcast ceiling at 400 feet. There is light rime icing from 400 to
6400 feet AGL and the lowest altimeter setting from 020000Z until 022200Z is 29.83
inches of mercury. There is a blowing snow-induced surface based partial obscuration
from 1/8 to 2/8 in coverage.
1.3.8.1.4. Between 020100Z and 020300Z, conditions vary temporarily to winds from
130 degrees at 15 knots gusting to 25 knots, vis ibility 200 meters with light freezing
drizzle and fog, sky totally obscured with vertical visibility 100 feet. There is also
moderate icing (clear) in precipitation from surface to 1000 feet AGL and moderate
icing in cloud (rime) from 1000 feet AGL up to 10000 feet AGL. The forecast
maximum temperature is 00 °C at 012100Z and the forecast minimum temperature is
minus 01°C at 021200Z.
1.3.8.2. Example Corrected (COR) TAF. Figure 1.4 provides an example of a corrected
(COR) TAF for Ramstein AB, Germany. Interpretation and explanation of the coded
information follows.
Figure 1.4. Corrected TAF Example.
TAF COR ETAR 011615Z 0116/0222 28012G25KT 8000 -RASN SCT006 BKN015
OVC020 620158 540009 QNH2960INS
BECMG 0118/0119 27012KT 9999 NSW SCT015 BKN020 QNH2965INS TX15/0120Z
TN04/0211Z
1.3.8.2.1. The forecast is a correction for Ramstein AB, Germany (ETAR), issued on
the first of the month at 1615Z, valid from 011600Z to 022200Z. Initial conditions
(011600Z to 011900Z) for the forecast are winds from 280 degrees at 12 knots gusting
to 25 knots, visibility 8000 meters in light rain and snow, sky cover is scattered at 600
feet, broken at 1500 feet, and overcast at 2000 feet. There is light rime icing in cloud
between 1500 and 9500 feet AGL and occasional moderate turbulence in cloud from
surface to 9000 feet AGL. Lowest altimeter setting from 011600Z to 011900Z is 29.60
inches of mercury.

## Page 10

AFMAN15-124 16 JANUARY 2019 15
1.3.8.2.2. Between 011800Z and 011900Z, the predominant condition changes
gradually to w inds from 270 degrees at 12 knots, visibility greater than or equal to
9,999 meters, no significant weather, sky cover scattered at 1500 feet and broken at
2000 feet. The lowest altimeter setting from 011900Z to 022200Z is 29.65 inches of
mercury. The fo recast maximum temperature is 15 °C at 012000Z and the forecast
minimum temperature is forecast 4°C at 021100Z.
1.3.9. Operationally significant/Hazardous weather Groups. Volcanic ash and wind shear are
potentially hazardous problems for aircraft. Include forecasts for ash and non-convective wind
shear on an as-needed basis to focus the attention of the pilot on existing or expected problems.
1.3.9.1. VA. The volcanic ash group indicator. Volcanic Ash (VA) Group (VAbbbttt).
Include a VA group in the TAF, following the cloud and obscuration group. Encode all
VA plume forecasts provided by the VAAC in TAF coded products. The VA plume
forecast must be horizontally consistent with the official VAAC forecast. (T-0) Note: If
the responsible VAAC cannot produce the volcanic ash products, then Air Force forecasts
are the primary source. (T-0)
1.3.9.1.1. bbb. The height of the base of the volcanic ash, encoded in hundreds of feet
AGL
1.3.9.1.2. ttt. The height of the top of the volcanic ash layer, encoded in hundreds of
feet AGL, as forecast by the VAAC.
1.3.9.1.3. When forecasting VA to be surface based, encode VA as both present
weather (w’w’) and add a VA group. The following examples show the use of the VA
group:
Figure 1.5. Example of Surface-based Volcanic Ash Forecast.
TAF CCCC 101555Z 1016/1122 24010KT 9999 VA FEW100 VA000200 QNH2992INS
1.3.9.1.4. In this example VA is surface -based and aloft. The VAAC ash plume
forecast from the surface with a plume top of 20,000 feet.
Figure 1.6. Example of Volcanic Ash Plume Forecast.
TAF CCCC 101555Z 1016/1122 24010KT 9999 FEW100 VA100200 QNH2992INS
1.3.9.1.5. VA is not surface-based but forecasted in a VAAC ash plume over the TAF
location. The VAAC forecasted ash plume has a base height of 10,000 feet and a plume
top of 20,000 feet.
1.3.9.2. Non-Convective Low-Level Wind Shear Group (WShxhxhx/dddfffKT). Use this
group only to forecast wind shear not associated with convective activity from the surface
up to and including 2,000 feet AGL.
1.3.9.2.1. Encode non-convective low -level wind shear forecasts in the following
format:
1.3.9.2.1.1. WS. Low-level wind shear group indicator.
1.3.9.2.1.2. hxhxhx. Forecast height of the wind shear in hundreds of feet AGL.

## Page 11

16 AFMAN15-124 16 JANUARY 2019
1.3.9.2.1.3. ddd. Forecast wind direction, in tens of degrees true, above the
indicated height. Do not use VRB in the non -convective low -level wind shear
forecast group.
1.3.9.2.1.4. ff. Forecast wind speed, in knots, of the forecast wind above the
indicated height.
1.3.9.2.1.5. KT. Unit indicator for wind speed in knots.
1.3.9.2.2. Non-convective low -level wind shear forecasts are included in the TAF,
when expected, following the cloud forecast and before the altimeter setting forecast in
the initial forecast period or in a FM or BECMG group. Once included in the forecast,
the wind shear group remains the prevailing condition until the next FM or BECMG
group or until the end of the forecast valid period if there are no subsequent FM or
BECMG groups. Forecasts for non -convective low -level wind she ar will not be
included in TEMPO groups. (T-1)
1.3.9.2.2.1. The following is an example of a TAF containing a non -convective
low-level wind shear forecast.
Figure 1.7. Example of TAF with Non-Convective Low-Level Wind Shear.
TAF CCCC 011555Z 0116/0222 03008KT 0800 PRFG FEW000 BKN005 BKN012
WS015/12038KT QNH3001INS FG FEW000
TEMPO 0118/0120 14012G18KT 3200 -SN BLSN FEW000 OVC006 620065 SN FEW000
FM012130 15012G20KT 9999 NSW SCT030 QNH2992INS
BECMG 0123/0124 15012G20KT 3200 -SN BLSN FEW000 OVC004 620046
QNH2983INS SN FEW000 TX08/0119Z TNM04/0211Z
1.3.9.2.2.2. In this TAF, non -convective low -level wind shear is forecasted at
1,500 feet with winds from 120 degrees at 38 knots from 011600Z until the
beginning of the next FM group at 012130Z.
1.3.10. Icing Group (6IchihihitL). Forecast icing group used to forecast icing not associated
with thunderstorms (thunderstorm forecasts imply moderate or greater icing). Repeat as
necessary to indicate multiple icing layers. Omit when no icing is forecast. Format icing
groups as:
1.3.10.1. 6—Icing group indicator.
1.3.10.2. Ic—Type of icing ( Table 1.5). When forecasting more than one type of icing
within the same layer, encode the highest code figure
1.3.10.3. hihihi—Height of base of forecasted icing layer in hundreds of feet AGL (Table
1.4).
1.3.10.4. tL—Icing layer thickness in thousands of feet ( Table 1.6). When forecasting a
layer to be thicker than 9,000 feet, repeat the icing group so that the base of the layer
expressed by the second group coincides with the top layer given by the first group (See
Note).

## Page 12

AFMAN15-124 16 JANUARY 2019 17
1.3.11. Turbulence group (5BhBhBhBtL). Forecast turbulence group u sed only to forecast
turbulence not associated with a thunderstorm (thunderstorms already imply severe or extreme
turbulence). Turbulence forecasts apply to category II (CAT II) aircraft. A list of aircraft
turbulence categories can be found in Air Force Handbook (AFH), 11-203, Volume 2, Weather
for Aircrews – Products and Services . Omit when no turbulence is forecasted. Format
turbulence groups as:
1.3.11.1. 5—Turbulence group indicator.
1.3.11.2. B—Type and intensity of turbulence (Table 1.7)—When forecasting more than
one type of turbulence within the same layer, encode the highest code figure
1.3.11.3. hBhBhB—Height of base of forecasted turbulence layer in hundreds of feet AGL
(Table 1.4).
1.3.11.4. tL—Thickness of the turbulence layer in thousands of feet ( Table 1.6)—When
forecasting a layer to be thicker than 9,000 feet, repeat the turbulence group so that the
base of the layer expressed by the second group coincides with the top layer given by the
first group . NOTE: Icing and turbulence forecasts are for phenomena not associated with
thunderstorm activity, from surface to 10,000 feet AGL. Forecasters may address the areas
above 10,000 feet mean sea level (MSL) provided the forecast in the TAF is horizontally
consistent with turbulence products in the forecaster -in-the-loop (FITL) graphics.
Deviations from the authoritative forecast require concurrence from the servicing OWS.
Table 1.4. Height of Lowest Level of Turbulence (hBhBhB)/Icing (hihihi).
Code Figure Meters Feet
000 <30 <100
001 30 100
002 60 200
003 90 300
004 120 400
005 150 500
006 180 600
007 210 700
008 240 800
009 270 900
010 300 1,000
011 330 1,100
099 2,970 9,900
100 3,000 10,000
110 3,300 11,000
120 3,600 12,000

## Page 13

18 AFMAN15-124 16 JANUARY 2019
Table 1.5. Icing Type (Ic).
Code Figure Type of Icing
0 Trace icing
1 Light icing (mixed)
2 Light icing in cloud (rime)
3 Light icing in precipitation (clear)
4 Moderate icing (mixed)
5 Moderate icing in cloud (rime)
6 Moderate icing in precipitation (clear)
7 Severe icing (mixed)
8 Severe icing in cloud (rime)
9 Severe icing in precipitation (clear)
Table 1.6. Thickness of Turbulence/Icing Layers (tL).
Code Figure Thickness
1 1,000 feet
2 2,000 feet
3 3,000 feet
4 4,000 feet
5 5,000 feet
6 6,000 feet
7 7,000 feet
8 8,000 feet
9 9,000 feet

## Page 14

AFMAN15-124 16 JANUARY 2019 19
Table 1.7. Turbulence Type/Intensity (B).
Code Figure Turbulence Type and Intensity
0 None
1 Light Turbulence
2 Moderate Turbulence in clear air, occasional.
3 Moderate Turbulence in clear air, frequent.
4 Moderate Turbulence in cloud, occasional.
5 Moderate Turbulence in cloud, frequent.
6 Severe Turbulence in clear air, occasional.
7 Severe Turbulence in clear air, frequent.
8 Severe Turbulence in cloud, occasional.
9 Severe Turbulence in cloud, frequent.
X Extreme Turbulence
Note: Occasional is defined to occur less than 1/3 of the time.
Frequent is defined as occurring greater than or equal to 1/3 of the
time.
1.3.12. Lowest Altimeter group (QNHP1P1P1P1INS). Lowest altimeter setting expected (in
inches of mercury) during the initial forecast period and in each Becoming (BECMG) and
From (FM) change group. Do not include QNH in Temporary (TEMPO) groups. Format the
altimeter group as:
1.3.12.1. QNH—Altimeter setting in inches of mercury indicator
1.3.12.2. P1P1P1P1—Forecast lowest altimeter setting
1.3.12.3. INS—Indicator for units of measure for inches of mercury.
1.3.13. TAF Remarks. For weather and obscurations, use the alphabetic abbreviations in
Table 1.2 Use Federal Aviation Administration (FAA) Order JO 7340.2, Contractions, for all
others. Relate operationally significant forecast elements to geographical f eatures within the
aerodrome radius when possible and add start/end times without adding a Z when applicable
(e.g. FG OVR RIVER E, WND 06010KT AFT 1219, or SHRA OMTNS E 1414 -1419).
Ensure start/end times are not confused with other numerical values. Do n ot use the terms
OCNL, VC, or CB in remarks. Do not use the remarks section as a substitute for a BECMG
or TEMPO group. Encode remarks in the following order of entry:
1.3.13.1. Forecast Maximum and Minimum Temperature groups
(T(X)(N)[M]TFTF/YYGFGFZ). This group provides a mechanism to forecast a two-
digit temperature (TFTF: whole degrees Celsius) in the TAF code for specific times. To
indicate forecast maximum and minimum temperatures expected to occur at the time
indicated by GFGFZ, the le tter indicator TX for the maximum forecast temperature and
TN for the minimum forecast temperature shall precede TFTF without a space.
Organizations encode the forecast maximum (first entry) and minimum temperature (last
entry) for the first 24-hour period of the TAF. Format temperature groups as:
1.3.13.1.1. TX— Maximum Temperature remark indicator
1.3.13.1.2. TN— Minimum Temperature remark indicator

## Page 15

20 AFMAN15-124 16 JANUARY 2019
1.3.13.1.3. TFTF—The forecast temperature in whole degrees Celsius (C). Precede
temperatures between +9°C and -9°C with a zero (0); precede temperatures below 0°C
by the letter M (for minus).
1.3.13.1.4. YY—The 2 digit day of the month.
1.3.13.1.5. GFGF—The valid time to the nearest whole hour UTC of the temperature
forecast.
1.3.13.1.6. Z—Abbreviation for Zulu, the military time zone associated with UTC.
Figure 1.8. Example of Min/Max Temperature Groups.
TX17/0721Z TN08/0812Z — forecast maximum temperature is 17°C at 072100Z and
forecast minimum temperature is 8°C at 081200Z.
TX00/1418Z TNM09/1507Z — forecast maximum temperature is 0°C at 141800Z and
forecast minimum temperature is minus 9°C at 150700Z.
1.3.13.2. Limited-Duty and Limited METWATCH Remarks. Limited -duty locations
coordinate with their supporting Operational Weather Squadron on all TAF valid times
around operational hours. At locations where limited -duty operations (i.e. when there is
not 24 -hour coverage with weather personnel on duty) are in effect, use the following
remarks with YY being the day of the month UTC and GG is the time to the nearest whole
hour UTC.
1.3.13.2.1. LAST NO AMDS AFT YYGG NEXT YYGG—Use this remark when the
airfield is closed and a TAF is no longer required per coordinated requirements.
1.3.13.2.2. LIMITED METWATCH YYGG TIL YYGG —Use this remark when an
airfield is open, no weather personnel are on duty and an operational automated sensor
is not in use.

## Page 16

82 AFMAN15-124 16 JANUARY 2019
Attachment 1
GLOSSARY OF REFERENCES AND SUPPORTING INFORMATION
References
AFPD 15-1, Weather Operations, 12 November 2015
AFH 11-203 V2, Weather For Aircrews – Products and Services, 21 May 2018
AFI 15-128, Air Force Weather Roles and Responsibilities, 07 February 2011
AFMAN 15-111, Surface Weather Observations, 21 January 2016
AFMAN 15-129 V1, Air and Space Weather Operations – Characterization, 21 March 2017
AFMAN 15-129 V2, Air and Space Weather Operations – Exploitation, 26 June 2008
AFMAN 33-363, Management of Records, 30 May 2018
AFTTP(I) 3-2.56, Change 1, Multiservice Tactics, Techniques, and Procedures for Chemical
Biological, Radiological, and Nuclear Contamination Avoidance, 02 February 2006
FAA Order JO 7340.2, Contractions, 06 March 2018
FAA Order JO 7350.9, Location Identifiers, 18 July 2018
FAA Order JO 7360.1, Aircraft Type Designators, 23 April 2018
Federal Meteorological Handbook No. 12 (FCM-H12), United States Meteorological Codes and
Coding Practices, 1 January 2013
NATO AWP-4(B), NATO Meteorological Codes Manual
World Meteorological Organization (WMO) Manual on Codes, No. 306, Volume 1.I, Part A
Adopted Forms
AF Form 847, Recommendation for Change of Publication
Abbreviations and Acronyms
Minus (-)—Light Intensity
Plus (+)—Heavy Intensity
ABV—Above
ADF—Active Dark Filament
AFMAN—Air Force Manual
AFS—Arch Filament System
AGL—Above Ground Level
AKNOW—Event Acknowledgement Code
APR—Active Prominence Region
ASR—Active Surge Region

## Page 17

AFMAN15-124 16 JANUARY 2019 83
BC—Patches
BKN—Broken
BL—Blowing
BLO—Below
BR—Mist
BSD—Bright Surge on Disk
BURST—Discrete Solar Radio Burst
BXOUT—Videometer Box Dimension Outline
CA—Cloud to air
CAT—Category
CB—Cumulonimbus
CBRN—Chemical, Biological, Radiological, Nuclear
CC—Cirrocumulus, or Cloud to cloud lightning
CG—Cloud to ground
CHOP—Turbulence type characterized by rapid, rhythmic jolts
CLR—Clear
CONS—Continuous
CONTRAILS—Condensation trails
COR—Correction To A Previously Disseminated Report
CS—Cirrostratus
CU—Characterization Unit
DALAS—Solar Disk and Limb Activity Summary Code
dB—Decibel
DoD—Department Of Defense
DR—Low Drifting
DS—Dust-storm
DSD—Dark Surge on Disk
DSF—Disappearance of a Solar Filament
DSN—Defense Switched Network
DU—Widespread Dust
DURC—During Climb
DURD—During Descent

## Page 18

84 AFMAN15-124 16 JANUARY 2019
DZ—Drizzle
EDM—Effective Downwind Message
EPL—Eruptive Prominence on Limb
EST—Estimate, Estimated
EVENT—Event Code
EXTRM—Extreme
FAA—Federal Aviation Administration
FALSE—False Alarm
FC—Funnel Cloud
+FC—Tornado or Waterspout
FEW—Few
FG—Fog
FITL—Forecaster in the Loop
FLARE—Solar Flare Code
FLIP—Flight Information Publication
Fmin—Minimum Observed Frequency
foEs—Sporadic E Critical Frequency
fo F1—F1 Region Critical Frequency
fo F2—F2 Region Critical Frequency
FRQ—Frequent
FU—Smoke
FZ—Freezing
G—Gust
GHz—Giga Hertz (109 Hz)
GMT—Greenwich Mean Time
GPS/NAVSTAR—Global Positioning System/Navigation, Surveillance, Tracking, and Reporting
GR—Hail
GS—Snow Pellets
HLSTO—Hailstone(s)
HSTRY—Histogram History Code
HVY—Heavy
Hz—Hertz

## Page 19

AFMAN15-124 16 JANUARY 2019 85
HZ—Haze
IC—Ice Crystals, In-Cloud Lightning
IFLUX—Integrated Solar Radio Flux Code
IMC—Instrument Meteorological Conditions
IMS—Ionospheric Measuring System
INTMT—Intermittent
IONHT—Ionospheric Height Code
IONOS—Automated Ionospheric Data Code
IPP—Ionospheric Penetration Point
KT—Knots
LAST—Last Forecast Before A Break In Coverage At A Manual Station
LGT—Light
LLWS—Low level wind shear
LN—Line
LPS—Loop Prominence
LTG—Lightning
LYR—Layer
M—Meters, Sub-zero temperatures
MANOP—Manual Operations
METAR—Aviation Routine Weather Report
MHz—Mega Hertz (106 Hz)
MI—Shallow
MOD—Moderate
MOV—Moved/Moving/Movement
MSL—Mean Sea Level
OMTNS—Over Mountains
MXD—Mixed
NATO—North Atlantic Treaty Organization
NAVAID—Navigational aids
NE—Northeast
NEG—Negative
NMRS—Numerous

## Page 20

86 AFMAN15-124 16 JANUARY 2019
NSW—No Significant Weather
NW—Northwest
OCNL—Occasional
OVC—Overcast
PIREP—Pilot Weather Report
PL—Ice Pellets
PLAIN—Plain Language Code
PO—Dust/Sand Whirls
PY—Spray
RA—Rain
RCA—Reach Cruising Altitude
RFI—Radio Frequency Interference
RSTN—Radio Solar Telescope Network
S4—Mean Amplitude Scintillation Index
SA—Sand
SCT—Scattered
Sec—Second
SEV—Severe
SFC—Surface
Sfu—Solar Flux Units
SG—Snow Grains
SH—Shower(s)
Sigma—sub-delta-phi —Mean Phase Scintillation Index
SKC—Sky Clear
SLD—Solid
SM—Statute Miles
SN—Snow
SOON—Solar Observing Optical Network
SPOTS—Sunspot Code
SPY—Spray
SQ—Squall
SRBL—Solar Radio Burst Locator

## Page 21

AFMAN15-124 16 JANUARY 2019 87
SRS—Solar Radio Spectrograph
SS—Sand storm
STATS—Patrol Status Code
STN—Station
SWEEP—Spectral Solar Radio Burst Code
SWPC—Space Weather Prediction Center
TAF—Terminal Aerodrome Forecast
TARWI—Target Weather Information Reporting Code
TBD—To Be Determined
TCU—Towering Cumulus
TEC—Total Electron Current
TEI—Text Element Indicator
TELSI—Total Electron Content and Scintillation Code
TOC—Top of Climb
TOP—Top of Clouds
TS—Thunderstorm
UA—TEI used in routine PIREP
UNKN—Unknown PIREP TEI
UP—Unknown Precipitation
US—United States
USAF—United States Air Force
UTC—Coordinated Universal Time
UUA—TEI used in urgent PIREP
V—Variable
VA—Volcanic Ash
VAAC—Volcanic Ash Advisory Center
VC—Vicinity
VHF—Very High Frequency
VIS—Visibility
VOR—Very high frequency omnidirectional range station
VORTAC—Very high frequency omnidirectional range station/tactical air navigation
VRB—Variable

## Page 22

88 AFMAN15-124 16 JANUARY 2019
VV—Vertical Visibility
WMO—World Meteorological Organization
WND—Wind
XR—Solar X-ray Event Indicator
Terms
Bulletin Heading—A combination of letters and numbers that describe the content s of a
bulletin, including the data type, geographical location, four -letter identifier of the originator and
a date-time group. (e.g. MANOP heading)
Contrails (Condensation trails)—A visible cloud streak, usually brilliant white in color, which
trails behind an aircraft or other vehicle in flight under certain conditions.
File Time—The time a weather message or bulletin is scheduled to be transmitted. Expressed
either as a specific time or as a specific time block during which the message is transmitted.
Four-letter identifier —A specifically authorized four -letter code assigned to a location and
documented by International Civil Aviation Organization.
Issue Time —Time the last agency was notified. Exclude follow -up notifications when
determining issue time.
Limited Duty Station—A weather station that provides less than 24-hour a day forecast service.
NAVAID—An electronic navigation aid facility, specifically limited to VHF Omni -Directional
Radio Range (VOR), or combined VHF Omni -Directional Radio Range/Tactical Air Navigation
(VORTAC) facilities.
Pilot Report—A report of in-flight weather provided by an aircraft crewmember.
Text Element Indicator (TEI)—A two-letter contraction with slash used in the standard PIREP
message to identify the elements being reported.
Vicinity—Used to report present weather phenomena when greater than 5 but less than or equal
to 10 statute miles of the station.
