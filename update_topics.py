import json
import re

raw_data = """Variables & Input/Output (Python)
ATM balance display system
Grocery bill calculator
Mobile recharge amount checker
Fuel cost calculator
Electricity bill generator
Water bill calculator
Internet data usage tracker
Restaurant bill splitter
Coffee shop billing system
Movie ticket price calculator
Cab fare estimator
Bus ticket booking amount
Train travel fare calculator
Flight luggage weight checker
Parking fee calculator
Toll gate payment system
Hotel room booking calculator
Food delivery charge calculator
Courier shipping cost estimator
Bike rental charge calculator
Student marks total calculator
Student average marks system
CGPA calculator
Attendance percentage calculator
School fee receipt generator
Library fine calculator
Exam hall ticket details display
Online course payment tracker
Tuition fee balance checker
Rank prediction system
Employee salary calculator
Employee bonus calculator
Overtime payment calculator
Tax deduction estimator
Daily wage calculator
Monthly expense tracker
Office attendance logger
Payslip generator
Work hour tracker
Freelancer invoice calculator
BMI calculator
Daily calorie intake tracker
Water intake reminder system
Medicine dosage reminder
Hospital bill calculator
Patient registration system
Blood donation eligibility checker
Step counter system
Sleep hour tracker
Fitness progress tracker
Instagram followers counter
YouTube views analyzer
WhatsApp message counter
Facebook likes tracker
TikTok watch time calculator
Social media engagement tracker
Gaming score display system
Online streaming subscription checker
Playlist duration calculator
Mobile storage usage checker
Weather temperature converter
Rainfall measurement recorder
Air quality index display
Wind speed converter
Temperature average calculator
Smart farming water tracker
Crop fertilizer calculator
Milk production tracker
Poultry farm egg counter
Livestock feeding calculator
Bank interest calculator
Loan EMI estimator
Savings goal tracker
Stock profit calculator
Cryptocurrency value converter
Daily sales report generator
Product discount calculator
Supermarket billing system
Online shopping cart total
Cashback reward calculator
Phone battery percentage display
Laptop RAM usage tracker
Internet speed recorder
Password length checker
QR code payment amount display
App login welcome screen
Smart home electricity monitor
Device warranty checker
Recharge validity checker
Printer page cost calculator
Event ticket booking system
Wedding budget planner
Birthday expense calculator
Donation amount tracker
Festival shopping budget system
Daily diary entry counter
Time zone converter
Currency exchange calculator
Digital clock display
Age calculator from birth year
ATM PIN verification system
Login authentication checker
Voting eligibility checker
Driving license eligibility
Movie age restriction checker
Exam pass/fail system
Scholarship eligibility checker
Loan approval system
Credit card eligibility checker
Insurance eligibility checker
Online shopping discount checker
Festival offer validation
Coupon code verification
Cashback eligibility system
Buy-one-get-one offer checker
Minimum order eligibility checker
Free delivery eligibility
Restaurant table availability checker
Hotel room availability checker
Flight seat availability system
Cab fare surge pricing checker
Train ticket waiting list checker
Fuel low warning system
Vehicle speed limit checker
Toll payment verification
Traffic signal decision system
Parking slot availability checker
Bike helmet detection logic
Seat belt reminder system
Driver drowsiness alert logic
Student grade calculator
Rank prediction system
Attendance shortage warning
School fee due checker
Library fine checker
Exam eligibility system
Online class attendance checker
Assignment submission late checker
Duplicate registration checker
Hall ticket validation system
Employee salary bonus eligibility
Employee overtime calculation check
Office late entry warning
Leave approval system
Promotion eligibility checker
Employee ID verification
Payroll deduction checker
Freelancer payment validation
Work-from-home eligibility
Interview shortlist system
Hospital patient priority checker
Blood donor eligibility
BMI health category checker
Diabetes risk indicator
Water intake reminder logic
Calorie limit checker
Medicine reminder checker
Heart rate abnormality checker
COVID symptom screening
Sleep quality checker
WhatsApp online status checker
Instagram account privacy checker
Password strength validator
Email verification checker
Spam message detector
Social media age restriction
Mobile OTP verification
Account blocked checker
YouTube age-content restriction
Gaming level unlock checker
Weather alert system
Rain prediction warning
Air quality danger checker
Smart farming irrigation checker
Crop disease detection logic
Temperature safety checker
Flood warning system
Water tank overflow alert
Electricity overload warning
Solar battery low checker
Bank minimum balance checker
EMI payment due checker
Savings goal completion checker
Daily expense limit checker
Product stock availability
E-commerce return eligibility
Product warranty validity checker
Online payment success/failure checker
QR payment validation
Subscription expiry checker
Mobile battery low warning
Storage full warning system
WiFi connection checker
Bluetooth device availability
Software update checker
Internet speed quality checker
Device overheating warning
Printer paper availability checker
Smart home light automation
Face unlock authentication system
Daily step counter tracker
Monthly expense tracker
Weekly water intake tracker
Employee attendance counter
Student attendance system
Grocery item billing loop
Restaurant order taking system
Food delivery order tracker
Petrol filling transaction counter
Bus passenger counting system
Cricket score updating system
Football match score tracker
Gym repetition counter
Workout timer repetitions
Running lap counter
Video watch history tracker
YouTube playlist autoplay system
Music playlist repeat system
Instagram story viewer counter
WhatsApp unread message checker
ATM transaction history display
Banking menu repetition system
Password retry attempts checker
Login attempt limiter
OTP verification retry system
CAPTCHA retry checker
Online quiz question navigator
Exam answer evaluation loop
Online voting repetition system
Feedback form submission tracker
Cab booking request handler
Ride-sharing passenger allocation
Hotel room booking display
Flight passenger boarding counter
Railway waiting list updater
Toll gate vehicle counter
Parking slot monitoring system
Traffic signal countdown timer
Smart traffic vehicle counter
Delivery tracking updates
Online shopping cart item loop
Product inventory checker
Warehouse stock counting
Billing counter system
Daily sales report generator
Product barcode scanning system
E-commerce order processing
Cashback reward tracker
Coupon validation retries
Refund request processing system
Employee payroll processing
Salary slip generation system
Overtime hours calculator
Freelancer invoice generator
Tax payment tracker
Daily work progress tracker
Office meeting attendance recorder
Team task completion tracker
Project milestone checker
Customer support ticket processor
Hospital patient queue system
Medicine stock monitoring
Patient appointment scheduler
Heartbeat monitoring system
Fitness calorie burn tracker
Water reminder notification loop
Sleep cycle monitoring
Blood pressure reading tracker
Ambulance emergency request monitor
COVID patient record system
Weather temperature recording system
Rainfall data collection
Air quality monitoring system
Crop irrigation scheduler
Soil moisture monitoring
Smart farming sensor tracker
Water tank level monitoring
Electricity meter reading tracker
Solar panel power tracker
Garbage collection monitoring system
Mobile notification checker
Battery percentage monitoring
WiFi signal strength tracker
Bluetooth device scanner
Device charging monitor
Software installation progress bar
Download progress tracker
Printer queue processing
File upload progress checker
Cloud storage synchronization tracker
Daily diary entry recorder
Event registration counter
Wedding guest entry tracker
Donation collection tracker
Classroom student roll caller
Library book issue tracker
Cinema seat booking monitor
Smart home appliance monitoring
Face recognition attendance tracker
AI chatbot continuous conversation loop
Email validation system
Password strength checker
Username availability checker
Mobile number formatter
Aadhaar number masking
PAN card format validator
Vehicle number validation
OTP verification system
Website URL checker
Domain name validator
WhatsApp message analyzer
Instagram hashtag extractor
YouTube comment filter
Spam message detector
Profanity word checker
Chatbot keyword detector
Auto reply message system
Social media caption formatter
Tweet character counter
Bio text length checker
Resume keyword analyzer
PDF filename validator
File extension checker
Duplicate filename detector
Folder name cleaner
Search bar keyword finder
Browser history search system
Text autocomplete feature
Voice command text matcher
AI prompt cleaner
Online form input validator
Login username checker
Login password validator
Registration form validator
Address formatting system
Postal code validator
Country code checker
Time format validator
Date format checker
Currency format checker
Restaurant menu search system
Food order keyword detector
Product review analyzer
E-commerce search filter
Coupon code validator
Product SKU validator
Invoice ID checker
QR payment text parser
Billing message formatter
Cashback notification analyzer
Student name formatter
Roll number validator
Exam hall ticket verifier
Grade message generator
Attendance status formatter
Assignment plagiarism keyword check
Online class chat analyzer
School announcement formatter
Certificate name generator
Library book search system
Employee ID validator
Office email checker
Meeting invitation formatter
Payslip text generator
Leave application analyzer
HR chatbot keyword detector
Work report summarizer
Company policy search system
Resume parser
Freelancer proposal formatter
Hospital patient ID checker
Prescription text analyzer
Medicine name validator
Blood group format checker
Health report keyword finder
Symptom keyword detector
Appointment SMS formatter
Emergency contact validator
Insurance policy number checker
Medical chatbot text matcher
Weather alert message analyzer
Smart farming crop keyword detector
Rain warning SMS formatter
Electricity complaint parser
Water bill message analyzer
Pollution report keyword checker
Disaster alert notification formatter
Traffic update text analyzer
GPS location text parser
Smart city complaint analyzer
Movie subtitle word counter
Song lyric cleaner
Netflix search keyword checker
Gaming username validator
Live stream chat analyzer
AI voice assistant command checker
Smart TV search parser
Mobile app notification formatter
Digital clock time validator
Translation app language detector
Shopping cart item manager
Grocery list organizer
Food delivery order tracker
Restaurant menu management
Online product catalog system
Inventory stock manager
Warehouse item tracker
Supermarket billing items list
Wishlist product organizer
E-commerce recently viewed products
Student marks analyzer
Attendance record system
Exam result manager
Classroom student list organizer
Rank list generator
Assignment submission tracker
Online course progress tracker
Library borrowed books tracker
School timetable organizer
Quiz score manager
Employee salary records
Office attendance tracker
Team task management system
Work progress tracker
Meeting participant organizer
Freelancer project list
Payroll employee manager
Leave application tracker
Interview candidate shortlisting
Company department organizer
WhatsApp contact list manager
Instagram followers tracker
YouTube playlist manager
Facebook friend suggestion system
Spotify music playlist organizer
Netflix watchlist manager
Mobile notification tracker
Chat history organizer
Email inbox categorizer
Video recommendation system
Cricket score tracker
Football team player manager
Tournament points table
Gym workout tracker
Daily step count analyzer
Fitness progress records
Marathon timing tracker
Sports team selection system
Player ranking analyzer
Match highlights organizer
Cab booking history tracker
Bus passenger management
Flight passenger list
Railway reservation tracker
Parking slot manager
Vehicle service history tracker
Delivery order tracking system
Ride-sharing passenger organizer
Traffic signal vehicle counter
Smart navigation route tracker
Hospital patient records
Appointment scheduling system
Medicine inventory manager
Blood donor database
Health report tracker
Fitness diet planner
Water intake tracker
Sleep monitoring records
Emergency contact organizer
Medical test results analyzer
Weather temperature records
Rainfall data tracker
Smart farming crop monitor
Electricity usage analyzer
Water tank level tracker
Pollution data organizer
Sensor reading manager
Solar energy tracker
Waste collection records
Disaster alert monitoring system
ATM transaction history
Bank customer account manager
Loan application tracker
Daily expense manager
Savings goal tracker
Cryptocurrency price tracker
Stock market analyzer
QR payment history organizer
Cashback rewards tracker
Subscription management system
Event guest list organizer
Wedding invitation tracker
Birthday reminder manager
Donation record tracker
To-do task manager
Notes organizer
File download manager
Photo gallery organizer
Smart home appliance tracker
AI chatbot conversation history manager
GPS location coordinate storage
Fixed product details system
RGB color value storage
Employee ID and name records
Student roll number records
Immutable bank transaction record
Cricket scoreboard statistics
Football match score records
Laptop specification storage
Mobile phone specification records
Train timing schedule storage
Flight departure timing records
Bus route coordinate storage
Delivery location tracker
Parking slot coordinates
Weather temperature records
Rainfall measurement storage
Air quality index records
Sensor data storage system
Smart farming soil data records
Hospital patient basic details
Blood group records system
Medicine fixed information storage
Medical test report records
Emergency contact information storage
Appointment timing records
Fitness progress measurements
Daily calorie tracking records
Heart rate monitoring records
Sleep cycle tracking data
Employee attendance records
Salary structure storage
Payroll transaction records
Office shift timing records
Meeting schedule storage
Company branch location records
Tax payment records
Freelancer payment details
Invoice fixed information storage
Work hour records
Shopping bill item records
Product barcode storage
Product dimension records
Online order tracking records
E-commerce product specifications
Cashback transaction records
Coupon code fixed data
QR payment information storage
Banking IFSC code records
Loan EMI details storage
WhatsApp message timestamp storage
Instagram post statistics
YouTube video analytics records
Social media account details
Playlist song information storage
Gaming score records
Streaming subscription details
Mobile notification records
Email sender information storage
Chatbot response dataset records
Student grade records
Classroom seating arrangement
Online course progress records
Hall ticket information storage
Certificate verification records
Assignment submission timestamps
Exam timetable storage
Quiz result records
School bus route records
Library book information storage
ATM machine location records
Bank branch details storage
Currency exchange rates
Daily stock market values
Cryptocurrency price records
Expense tracking records
Savings account details
Investment portfolio storage
Insurance policy details
Financial transaction history
Event schedule storage
Wedding function timing records
Birthday reminder details
Donation history records
Travel itinerary storage
Hotel booking details
Tourist place coordinate storage
Smart city traffic records
Electricity meter reading records
Water usage monitoring data
Device hardware information storage
WiFi network details
Bluetooth device records
Software version information
System configuration records
Printer setup information
Cloud server location records
API response data storage
AI training dataset records
Face recognition attendance records
Student database management system
Employee information storage
Contact book application
Product-price mapping system
Online shopping product catalog
Grocery item price tracker
Restaurant menu management
Hospital patient records
Bank customer account details
ATM user information system
Login authentication database
Username-password storage
Email contact manager
Mobile number directory
Address book system
Blood donor database
Library book records
School student details
College course information
Online class attendance tracker
Employee salary management
Payroll processing system
Freelancer client records
Office department management
Company branch information
Tax payment records
Loan customer database
Insurance policy records
QR payment transaction system
Cashback reward tracker
WhatsApp chat contact storage
Instagram follower tracker
YouTube video analytics
Spotify playlist information
Netflix watch history system
Social media account details
Gaming leaderboard system
Online voting counter
Poll result management
Survey response tracker
Cricket player statistics
Football team records
Match scoreboard management
Tournament points table
Gym member database
Fitness progress tracking
Daily calorie records
Water intake tracker
Sleep monitoring system
Workout plan organizer
Cab booking customer records
Bus passenger details
Flight reservation database
Railway ticket booking system
Parking slot information
Vehicle registration system
Delivery tracking details
Ride-sharing passenger system
Smart traffic monitoring
GPS location mapping
Weather information storage
Rainfall monitoring system
Air quality data records
Smart farming crop records
Soil moisture tracking
Electricity bill records
Water bill management
Solar energy monitoring
Waste management tracking
Disaster alert database
Daily expense tracker
Savings goal management
Cryptocurrency price mapping
Stock market tracker
Investment portfolio system
Invoice generation system
Product inventory manager
Warehouse stock records
Billing counter management
Subscription management system
Event registration system
Wedding guest management
Birthday reminder storage
Donation tracking system
Travel booking information
Hotel room reservation system
Tourist guide information
Cinema ticket booking
Food delivery order details
Smart home appliance tracker
Mobile app settings storage
WiFi password manager
Device configuration system
Browser bookmark manager
File metadata storage
Cloud storage records
API response parser
AI chatbot response database
Face recognition user records
Voice assistant command storage
Unique website visitor tracker
Unique mobile number collector
Duplicate email remover
Unique username checker
Unique hashtag tracker
Duplicate contact remover
Student attendance uniqueness checker
Unique employee ID validator
Unique product code system
Online voting duplicate prevention
Instagram follower uniqueness checker
YouTube subscriber uniqueness tracker
WhatsApp group member manager
Gaming unique player tracker
Spotify unique song collector
Netflix unique watch history
Browser unique search history
Unique notification tracker
Social media hashtag uniqueness
Unique comment detector
Shopping cart duplicate remover
Product inventory uniqueness checker
Unique coupon code validator
Unique QR payment tracker
Warehouse item duplicate detector
Online order ID uniqueness
Invoice number uniqueness checker
Cashback user uniqueness system
E-commerce category uniqueness
Product review duplicate detector
Unique student roll number system
Classroom unique participant tracker
Exam registration uniqueness checker
Assignment submission duplicate detector
Library unique book ID system
Online course enrollment uniqueness
Hall ticket number uniqueness
Certificate ID uniqueness checker
Quiz participant uniqueness tracker
School bus seat uniqueness
Employee attendance uniqueness checker
Unique department tracker
Freelancer client uniqueness system
Office meeting participant uniqueness
Payroll duplicate prevention
Leave request uniqueness checker
Work task uniqueness tracker
Unique interview candidate checker
Company asset uniqueness tracker
Office access card uniqueness
Hospital patient ID uniqueness
Blood donor uniqueness system
Medicine batch uniqueness checker
Appointment duplication prevention
Health report duplicate remover
Unique emergency contact tracker
Medical insurance uniqueness checker
Patient symptom uniqueness analyzer
Hospital room allocation uniqueness
Vaccine dose uniqueness tracker
Cricket player uniqueness checker
Football jersey uniqueness tracker
Tournament participant uniqueness
Fitness exercise uniqueness system
Daily step uniqueness tracker
Workout repetition uniqueness checker
Marathon participant uniqueness
Sports team selection uniqueness
Match ticket uniqueness checker
Gaming achievement uniqueness tracker
Vehicle registration uniqueness checker
Flight ticket uniqueness system
Railway seat uniqueness tracker
Cab driver uniqueness checker
Parking slot uniqueness system
Delivery tracking uniqueness
GPS coordinate uniqueness checker
Smart traffic vehicle uniqueness
Toll gate duplicate prevention
Ride-sharing passenger uniqueness
Weather alert uniqueness tracker
Rainfall data duplicate remover
Smart farming sensor uniqueness
Soil data uniqueness checker
Electricity meter uniqueness tracker
Water tank sensor uniqueness
Solar panel uniqueness system
Pollution record uniqueness checker
Disaster alert duplicate prevention
Smart city unique complaint tracker
Mobile device uniqueness checker
WiFi connected device uniqueness
Bluetooth device uniqueness tracker
File duplicate remover
Browser tab uniqueness checker
App installation uniqueness tracker
AI chatbot repeated query remover
Voice command uniqueness checker
Face recognition duplicate detection
Cloud storage duplicate file remover
ATM withdrawal function
ATM balance check function
Deposit money function
Login authentication function
OTP generation function
Password validation function
User registration function
Email verification function
Mobile number validation function
QR payment processing function
Shopping cart total calculator
Product discount calculation function
GST calculation function
Cashback calculation function
Bill generation function
Invoice creation function
Product stock update function
Coupon validation function
Delivery charge calculator
Refund processing function
Student marks total function
Grade calculation function
Attendance percentage function
CGPA calculator function
Rank prediction function
Assignment submission checker
Quiz score evaluator
Hall ticket generator
Student ID validator
Online exam timer function
Employee salary calculator
Bonus calculation function
Payroll generation function
Overtime payment calculator
Tax deduction function
Leave approval checker
Employee attendance function
Freelancer invoice function
Meeting scheduler function
Work progress tracker function
BMI calculator function
Daily calorie calculator
Water intake reminder function
Heart rate checker
Blood pressure analyzer
Medicine reminder function
Appointment booking function
Patient registration function
Health report generator
Emergency alert function
WhatsApp auto-reply function
Instagram hashtag extractor
YouTube comment filter
Chatbot response generator
Spam message detector
Social media analytics function
Playlist duration calculator
Notification sender function
Streaming subscription checker
Gaming score calculation function
Cricket score updater
Football points calculator
Tournament ranking function
Gym workout tracker
Daily step counter function
Marathon timing calculator
Sports player statistics function
Match winner prediction function
Fitness progress analyzer
Team selection function
Cab fare calculator
Railway ticket booking function
Flight seat availability checker
Parking fee calculator
Vehicle service reminder
GPS route calculation function
Delivery tracking function
Ride-sharing fare split function
Toll payment checker
Traffic signal timer function
Weather prediction function
Rain alert notification
Smart farming irrigation function
Soil moisture analyzer
Electricity bill calculator
Water usage monitoring function
Solar energy tracker
Pollution level checker
Disaster warning function
Smart city complaint function
File upload validator
WiFi password checker
Battery percentage alert
Device storage analyzer
Browser history cleaner
Cloud backup function
AI voice command processor
Face recognition attendance function
Smart home automation function
AI chatbot conversation handler
Cinema seat booking layout
Classroom seating arrangement
Parking slot management system
Hotel room allocation display
Bus seat reservation chart
Flight seating arrangement
Railway coach seat layout
Shopping mall floor mapping
Apartment room numbering system
Office cabin allocation system
Cricket scoreboard matrix
Football tournament fixture generator
Chessboard pattern generator
Sudoku board validator
Tic-Tac-Toe game board
Sports tournament points table
Gym workout schedule planner
Marathon participant grouping
Team player matching system
Match timetable generator
Student marks table generator
Attendance sheet management
Exam seating arrangement
School timetable generator
Grade comparison matrix
Classroom group allocation
Quiz score comparison system
Assignment submission tracker
Library book rack organizer
Online course progress table
Restaurant table booking chart
Food menu category display
Supermarket billing item matrix
Product inventory shelf organizer
Warehouse storage mapping
Shopping cart item comparison
Invoice item table generator
Daily sales report matrix
Product recommendation pairing
E-commerce category browser
Employee attendance dashboard
Payroll report generator
Office shift scheduling system
Meeting room allocation
Team task assignment tracker
Freelancer project allocation
Work progress comparison chart
Department employee mapping
Company branch employee matrix
Interview candidate evaluation table
Hospital patient room allocation
Appointment schedule matrix
Medicine stock rack organizer
Blood donor matching system
Health report comparison table
Emergency ward bed allocation
Patient symptom analysis matrix
Fitness exercise planner
Calorie tracking dashboard
Medical test result organizer
WhatsApp group member display
Instagram comment-reply system
YouTube playlist categorization
Social media analytics table
Gaming leaderboard display
Notification grouping system
Email inbox categorizer
Chatbot conversation flow display
Streaming watch history organizer
Multi-user chat room system
Cab booking route mapping
Traffic signal lane management
Parking floor-slot tracker
Delivery route planner
GPS coordinate grid display
Smart traffic vehicle analysis
Toll gate vehicle tracker
Ride-sharing passenger allocation
Vehicle service schedule matrix
Navigation path generator
Weather data comparison table
Rainfall yearly tracker
Smart farming crop planner
Soil moisture grid analysis
Water tank monitoring dashboard
Electricity usage comparison
Solar panel energy tracker
Pollution level heatmap logic
Waste collection zone mapping
Disaster management area planner
Mobile app grid menu system
Photo gallery grid display
File folder hierarchy viewer
Browser tab grouping system
Device network connection matrix
Cloud storage folder mapping
Face recognition attendance matrix
AI chatbot response pairing
Smart home device dashboard
Multiplayer game board system
Star hotel rating pattern
Pyramid building design
Apartment floor structure
Traffic lane divider pattern
Road marking simulation
Parking slot pattern
Theater seating arrangement
Wedding chair arrangement
Classroom bench arrangement
Stadium seating pattern
Mobile signal strength bars
WiFi signal indicator pattern
Battery charging level pattern
Loading progress bar design
Volume level indicator
Elevator floor display pattern
ATM cash slot animation
Smartwatch step progress display
Calendar date arrangement
Digital clock number pattern
Cricket scoreboard pattern
Football league ranking display
Chessboard pattern
Snake game movement pattern
Tetris block arrangement
Video game level map
Racing track lane pattern
Fitness workout repetition chart
Tournament bracket design
Medal ranking display
School attendance chart
Student mark sheet layout
Exam hall seating pattern
Library bookshelf arrangement
Timetable grid pattern
Assignment submission tracker display
Online course progress chart
Quiz leaderboard pattern
School bus seating layout
Classroom roll number display
Restaurant table layout
Food menu card pattern
Shopping mall floor directory
Product shelf arrangement
Grocery rack display pattern
Warehouse box arrangement
Billing receipt design
E-commerce product grid
Invoice table layout
QR code block simulation
Employee attendance dashboard
Office cabin layout pattern
Payroll report structure
Meeting seating arrangement
Company hierarchy chart
Work progress visualization
Task allocation matrix
Department organization chart
Office parking layout
Shift timing display
Hospital bed arrangement
Medicine storage rack pattern
Appointment schedule display
Patient queue visualization
Fitness calorie chart
Water intake tracker bars
Heartbeat waveform simulation
BMI level indicator
Emergency ward layout
Medical report table design
Rainfall chart pattern
Weather temperature graph logic
Smart farming field layout
Crop plantation grid
Water tank level display
Electricity usage bar chart
Solar panel arrangement
Pollution heatmap simulation
Disaster alert zone pattern
Smart city road network layout
WhatsApp chat bubble pattern
Instagram feed grid
YouTube video recommendation layout
Spotify playlist arrangement
Netflix content grid
Notification panel structure
Chatbot conversation flow display
Gaming leaderboard visualization
Social media analytics chart
Multi-user online status display
File folder hierarchy structure
Cloud storage directory tree
Mobile app icon grid
Browser tab arrangement
Device network topology pattern
Face recognition attendance table
AI training data matrix
Voice assistant waveform pattern
Smart home dashboard layout
Computer keyboard key arrangement
Student details save system
Employee records storage
ATM transaction history saver
Daily expense tracker file
Grocery bill generator
Restaurant order history storage
Shopping invoice saver
QR payment receipt generator
Bank account statement creator
Loan payment history storage
Login activity logger
Password storage system
User registration data saver
Email contact backup system
Mobile contact file manager
Chat history storage
WhatsApp message backup
Instagram comments saver
YouTube watch history storage
Browser history recorder
Student attendance file system
Exam result storage
Assignment submission tracker
School fee receipt generator
Hall ticket generator
Online course progress saver
Quiz score recorder
Library borrowed books log
Timetable storage system
Certificate generation system
Employee attendance logger
Salary slip generator
Payroll report storage
Leave request record system
Freelancer invoice saver
Work progress log system
Office meeting notes saver
HR employee database file
Task completion tracker
Company department records
Hospital patient record saver
Appointment booking storage
Medicine inventory file system
Blood donor database saver
Medical test report generator
Health report tracker
Fitness workout log
Daily calorie intake storage
Water intake tracker file
Emergency contact backup
Cricket score history saver
Football match result storage
Tournament points table saver
Gym workout progress tracker
Daily step count recorder
Sports player statistics saver
Match schedule storage
Marathon timing records
Gaming leaderboard saver
Tournament registration storage
Cab booking history logger
Railway ticket storage system
Flight reservation saver
Parking slot records
Delivery tracking history
GPS route log storage
Toll payment record saver
Ride-sharing trip history
Vehicle service history storage
Traffic monitoring data saver
Weather data recording system
Rainfall report storage
Smart farming sensor logs
Soil moisture data saver
Electricity bill history storage
Water usage report generator
Solar energy monitoring logs
Pollution data recording
Disaster alert report saver
Smart city complaint records
Mobile app settings backup
WiFi password storage system
Device configuration saver
File download history logger
Photo gallery metadata storage
Browser bookmarks exporter
Cloud backup system
File organizer application
Duplicate file detector log
Storage usage report generator
AI chatbot conversation saver
Face recognition attendance storage
Voice assistant command logger
Smart home device logs
API response data saver
Machine learning dataset creator
Online voting record system
Event registration storage
Wedding guest list saver
Daily diary text file system
ATM withdrawal invalid amount handler
Wrong PIN error handling system
Bank transfer failure handler
Online payment failure management
Invalid QR code scanner handling
Loan application input validation
Credit card transaction exception
Account balance retrieval failure
Duplicate transaction prevention
Currency conversion input error handling
Login invalid password handler
User registration duplicate email handling
OTP expiration exception
Invalid mobile number handling
Password mismatch checker
File upload format exception
Invalid username handling
Social media login failure handler
Browser connection timeout handler
WiFi authentication failure handling
Student marks invalid input handler
Attendance percentage division error
Online exam timeout exception
Invalid hall ticket number handling
School fee payment failure handling
Assignment file missing exception
Invalid CGPA input checker
Quiz answer validation errors
Duplicate student ID exception
Library fine calculation error handling
Employee salary calculation error
Payroll missing data exception
Leave request invalid date handling
Overtime calculation input errors
Freelancer invoice format handling
HR database missing record exception
Task deadline invalid input handler
Department record lookup failure
Meeting schedule conflict exception
Office attendance missing data handler
Hospital patient ID validation
Appointment booking conflict handler
Invalid medicine dosage handling
Blood group input validation
Medical report file missing exception
Emergency contact missing data handler
Fitness tracker invalid step count
Calorie calculator invalid input
Heart rate abnormal value exception
Health insurance record lookup failure
Cricket score invalid input handler
Match schedule conflict exception
Tournament registration duplicate handler
Gym equipment unavailable exception
Sports player ID validation
Marathon timing invalid data handler
Fitness app sync failure handling
Leaderboard ranking calculation errors
Match ticket booking conflict
Team selection invalid entry handler
Cab booking cancellation exception
Railway seat unavailable handling
Flight ticket booking timeout
Parking slot full exception
Delivery tracking missing data handler
GPS location unavailable exception
Toll payment network failure
Ride-sharing invalid passenger input
Vehicle service date validation
Traffic monitoring sensor failure
Weather API unavailable exception
Rainfall data missing handler
Smart farming sensor disconnect handling
Soil moisture invalid readings
Electricity bill calculation errors
Water usage negative value handling
Solar panel connection failure
Pollution monitoring data errors
Disaster alert network failure
Smart city complaint invalid data
Mobile battery percentage invalid input
File not found exception
Browser tab loading timeout
Cloud backup failure handling
Duplicate file upload exception
Device storage full handling
WiFi connection interruption handler
Printer paper missing exception
App crash recovery handling
Software update failure exception
AI chatbot invalid prompt handling
Face recognition mismatch exception
Voice assistant command error handling
Smart home device offline exception
API response invalid format handling
Machine learning dataset missing values
Online voting duplicate vote handling
Event registration duplicate entry
Wedding guest duplicate record handling
Daily diary file access exception
Bank account management system
ATM machine simulation
Student management system
Employee payroll system
Library management system
Hospital management system
School management application
College course management
Online examination system
Attendance management system
E-commerce shopping system
Shopping cart application
Product inventory manager
Restaurant ordering system
Food delivery application
Hotel booking management
Movie ticket booking system
Cab booking application
Railway reservation system
Flight booking system
Vehicle rental management
Car showroom management
Bike service center system
Parking management system
Toll gate automation system
Traffic signal management
GPS tracking application
Delivery tracking system
Courier management application
Smart transport management
Employee attendance tracker
Office task management
HR management system
Freelancer project manager
Company department system
Meeting scheduler application
Payroll processing software
Leave management system
Interview management platform
Customer support ticket system
Fitness tracker application
Gym membership management
Workout planner system
Diet recommendation app
Water intake reminder app
Calorie tracking system
Health report analyzer
Medical appointment booking
Medicine reminder application
Blood donor management system
WhatsApp chat application
Instagram clone system
YouTube video platform
Spotify music player
Netflix streaming platform
Social media profile manager
Gaming leaderboard system
Chatbot application
Notification management system
Email service simulator
Cricket score management
Football tournament system
Chess game application
Quiz game application
Snake and ladder game
Tic-Tac-Toe game
Online multiplayer game system
Player ranking system
Match scheduling application
Tournament organizer system
Smart farming management
Weather monitoring system
Water tank monitoring app
Electricity bill system
Solar energy tracker
Pollution monitoring application
Disaster alert management
Smart city monitoring system
Waste management application
Crop management system
Mobile phone management system
Laptop inventory manager
File management application
Browser tab manager
Cloud storage simulator
WiFi connection manager
Device battery monitoring system
Smart home automation app
Face recognition attendance system
Voice assistant application
Banking transaction analyzer
Cryptocurrency wallet system
Expense tracker application
Savings goal manager
Subscription management system
Invoice generator application
QR payment application
Event registration system
Wedding planning application
AI virtual assistant system
Search student by roll number
Find employee by ID
Search contact by mobile number
Search customer by account number
Find product by product ID
Search medicine by name
Search book in library system
Search movie by title
Find flight by flight number
Search train by train code
Search hotel room availability
Find restaurant by location
Search cab by driver ID
Search delivery order by tracking ID
Search parcel by reference number
Find bus route by route number
Search parking slot by slot ID
Search invoice by invoice number
Search QR payment by transaction ID
Find coupon by coupon code
Search student marks record
Find attendance by student ID
Search assignment by submission ID
Find exam result by hall ticket number
Search online course by course ID
Search teacher by employee ID
Find classroom by room number
Search timetable by class section
Find scholarship application by ID
Search certificate by certificate number
Search employee attendance record
Find payroll details by employee ID
Search freelancer project by project ID
Find company department by name
Search office meeting by meeting ID
Find work task by task number
Search support ticket by ticket ID
Search leave request by employee number
Find office branch by branch ID
Search salary slip by month
Search patient by patient ID
Find appointment by booking number
Search doctor by specialization
Find blood donor by blood group
Search medicine stock by batch ID
Find health report by report number
Search fitness workout by workout ID
Find calorie log by date
Search hospital room by room number
Search emergency contact by patient ID
Search WhatsApp contact by name
Find Instagram user by username
Search YouTube video by keyword
Find Spotify song by song ID
Search Netflix movie by genre
Find gaming player by username
Search notification by date
Find email by sender name
Search chatbot response by keyword
Search social media hashtag
Search cricket player by jersey number
Find football team by team name
Search tournament by tournament ID
Find gym member by membership number
Search sports score by match ID
Find marathon participant by bib number
Search player ranking by rank
Find match schedule by date
Search fitness progress by month
Find team coach by employee ID
Search weather report by city
Find rainfall record by date
Search smart farming crop by crop ID
Find soil sensor by sensor ID
Search electricity bill by meter number
Find water usage by customer ID
Search solar panel by panel ID
Find pollution data by location
Search disaster alert by region
Find smart city complaint by complaint ID
Search mobile app by app name
Find WiFi network by SSID
Search Bluetooth device by name
Find file by filename
Search browser history by keyword
Find cloud backup by backup ID
Search device by serial number
Find photo by image name
Search AI dataset by dataset ID
Find face recognition user by ID
Search bank transaction by transaction ID
Find cryptocurrency by coin name
Search expense by category
Find savings goal by target ID
Search event registration by ticket ID
Find wedding guest by invitation ID
Search donation record by donor ID
Find travel booking by booking ID
Search subscription by customer ID
Find voice assistant command by keyword
Sort students by marks
Sort employees by salary
Sort products by price
Sort movies by rating
Sort songs by duration
Sort contacts alphabetically
Sort bank transactions by date
Sort cricket players by score
Sort football teams by points
Sort hospitals by rating
Sort restaurants by distance
Sort hotels by price
Sort flight tickets by fare
Sort train schedules by time
Sort cab rides by distance
Sort grocery items by quantity
Sort shopping cart items by price
Sort invoices by amount
Sort cashback rewards by value
Sort coupons by expiry date
Sort students by attendance
Sort exam ranks by percentage
Sort assignments by submission date
Sort online courses by popularity
Sort teachers by experience
Sort classrooms by capacity
Sort library books alphabetically
Sort certificates by issue date
Sort quiz scores by highest marks
Sort school buses by route number
Sort employees by joining date
Sort payroll by payment amount
Sort projects by deadline
Sort freelancers by ratings
Sort tasks by priority
Sort meetings by schedule time
Sort office branches by employee count
Sort support tickets by urgency
Sort leave requests by date
Sort departments by performance
Sort patients by priority level
Sort appointments by timing
Sort medicines by expiry date
Sort blood donors by availability
Sort fitness records by calories burned
Sort workouts by duration
Sort health reports by test date
Sort hospital rooms by availability
Sort emergency cases by severity
Sort calorie logs by intake value
Sort WhatsApp chats by recent activity
Sort Instagram posts by likes
Sort YouTube videos by views
Sort Spotify songs by popularity
Sort Netflix shows by rating
Sort gaming players by score
Sort notifications by timestamp
Sort emails by unread status
Sort chatbot responses by frequency
Sort hashtags by trend count
Sort cricket matches by date
Sort football players by goals
Sort tournaments by prize amount
Sort gym members by membership duration
Sort marathon timings by fastest runner
Sort sports rankings by points
Sort team members by performance
Sort match schedules by venue
Sort fitness plans by difficulty
Sort coaches by years of experience
Sort weather reports by temperature
Sort rainfall data by highest rainfall
Sort crops by production quantity
Sort soil data by moisture level
Sort electricity bills by amount
Sort water usage by consumption
Sort solar panels by power generation
Sort pollution levels by AQI
Sort disaster alerts by severity
Sort smart city complaints by urgency
Sort mobile apps by downloads
Sort files by file size
Sort browser history by visit count
Sort cloud backups by storage size
Sort devices by battery percentage
Sort photos by creation date
Sort AI datasets by size
Sort WiFi networks by signal strength
Sort Bluetooth devices by proximity
Sort voice commands by usage frequency
Sort expenses by category amount
Sort savings goals by target date
Sort cryptocurrency prices by value
Sort investments by profit percentage
Sort event registrations by booking time
Sort wedding guests alphabetically
Sort donations by donation amount
Sort travel bookings by departure time
Sort subscriptions by expiry date
Sort face recognition records by attendance time
Folder and subfolder explorer
File search inside nested folders
Website sitemap generator
Organization hierarchy traversal
Family tree relationship explorer
Employee reporting structure viewer
Menu and submenu navigation system
Comment-reply thread display
Social media nested comments
Chatbot conversation tree traversal
Binary search in sorted student records
Search product in nested categories
Find contact in grouped directories
Search hospital department structure
Search classroom seating recursively
Search website pages recursively
Search cloud storage folders
Search nested JSON data
Search game map recursively
Search route paths recursively
Generate all password combinations
Generate OTP combinations
Generate all seating arrangements
Generate all team combinations
Generate tournament match pairings
Generate possible travel routes
Generate menu combinations in restaurant app
Generate all shopping cart combinations
Generate all quiz answer patterns
Generate all playlist arrangements
Calculate factorial for employee bonus logic
Fibonacci for investment growth prediction
Compound interest growth simulation
Population growth prediction
Virus spread simulation
Water tank filling simulation
Loan repayment reduction tracking
Savings growth tracker
Recursive calorie burn estimator
Recursive workout repetition counter
Tree-based file management system
Smart home device hierarchy traversal
Mobile app screen navigation flow
Browser history backtracking system
Undo-redo functionality in editor
Game level progression system
AI decision tree traversal
Voice assistant command hierarchy
Recursive chatbot response flow
Multi-level notification system
Hospital patient family record traversal
Recursive medicine reminder schedule
Blood donor network traversal
Recursive symptom checker
Recursive appointment scheduler
Recursive health report analysis
Recursive calorie calculation
Recursive sleep tracking system
Recursive emergency contact lookup
Recursive insurance claim processing
Recursive cricket tournament bracket
Recursive football knockout rounds
Recursive chess move evaluation
Recursive game maze solver
Recursive leaderboard ranking updates
Recursive player elimination system
Recursive score calculation system
Recursive fitness challenge tracker
Recursive sports schedule planner
Recursive tournament progression system
Recursive weather prediction modeling
Recursive rainfall analysis
Recursive farming irrigation planner
Recursive electricity consumption analysis
Recursive pollution spread simulation
Recursive disaster alert propagation
Recursive traffic route optimization
Recursive GPS shortest path finder
Recursive smart city monitoring
Recursive waste collection route planner
Recursive mobile storage cleaner
Recursive duplicate file finder
Recursive cloud backup scanner
Recursive image gallery traversal
Recursive browser tab grouping
Recursive app dependency checker
Recursive WiFi network scanning
Recursive Bluetooth device search
Recursive API response parser
Recursive AI dataset traversal
Recursive expense category analyzer
Recursive bank transaction tracker
Recursive investment portfolio analysis
Recursive event invitation hierarchy
Recursive wedding guest grouping
Recursive travel itinerary planner
Recursive subscription renewal checker
Recursive cryptocurrency profit analysis
Recursive face recognition folder scanner
Recursive virtual assistant workflow system
Browser back button system
Undo operation in text editor
Redo functionality system
Mobile app navigation history
ATM transaction rollback system
Calculator expression evaluator
Parentheses validation checker
HTML tag matching system
Code editor undo history
Game move backtracking system
Image editing undo feature
Music player previous song history
Video playback rewind tracker
Login session history tracker
Browser tab closing recovery
Shopping cart undo removal
E-commerce checkout rollback
AI chatbot conversation rollback
Notification dismissal recovery
Password retry rollback system
File explorer navigation history
Cloud storage undo delete
GPS route backtracking system
Maze solving application
Smart home action rollback
Voice assistant command undo
Drawing app undo strokes
Online form undo edits
Banking transaction cancellation
Online exam answer rollback
Compiler syntax checker
XML tag validator
JSON structure validator
PDF page navigation history
PowerPoint slide navigation
Playlist previous song stack
Camera app recent captures
Game inventory management
AI prompt history tracker
Search query history system
Cricket score undo system
Sports move replay tracker
Tournament bracket rollback
Fitness workout undo tracker
Hospital operation history
Medicine administration rollback
Emergency action reversal
Payroll rollback system
Invoice generation rollback
Event registration undo system
Hospital patient queue system
Bank token waiting system
Railway ticket booking queue
Flight boarding queue
Bus passenger waiting line
Food delivery order queue
Restaurant table waiting queue
Call center customer support queue
Printer job queue
WiFi packet transmission queue
Online exam submission queue
Chat message delivery queue
WhatsApp notification queue
Email sending queue
SMS delivery system
Video streaming buffer queue
Gaming matchmaking queue
Cab booking request queue
Ride-sharing passenger queue
Delivery dispatch queue
Traffic signal vehicle queue
Toll gate vehicle processing
Parking entry waiting queue
Smart city complaint queue
Electricity complaint processing
Water supply request queue
Disaster emergency response queue
Ambulance request queue
Weather alert notification queue
Farming irrigation scheduling queue
Employee payroll processing queue
Interview candidate waiting queue
Office meeting scheduling queue
Freelancer project assignment queue
Customer feedback processing queue
Task scheduling system
Operating system process scheduling
CPU job scheduling queue
Cloud server request queue
API request handling system
AI chatbot request queue
Voice assistant command queue
Face recognition processing queue
Machine learning training task queue
Mobile notification processing queue
Social media post scheduling queue
Event registration waiting queue
Movie ticket booking queue
Online shopping order processing queue
Subscription renewal processing queue"""

lines = [line.strip() for line in raw_data.split('\\n') if line.strip()]

# Filter out common headers or short lines
questions = []
for line in lines:
    if len(line) < 5:
        continue
    if "Real-World Questions" in line:
        continue
    if line.endswith("?"):
        continue
    questions.append(line)

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

for topic in topics:
    if topic['topicId'] == 'T9':
        existing_count = len(topic['problems'])
        for i, q in enumerate(questions):
            topic['problems'].append({
                "id": f"T9-{existing_count + i + 1}",
                "desc": q
            })
        break

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'w', encoding='utf-8') as f:
    json.dump(topics, f, indent=2)

print(f"Added {len(questions)} questions to T9")
