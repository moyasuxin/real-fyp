Faculty of Engineering, Science and Technology
School of Computing
BACHELOR OF INFORMATION TECHNOLOGY (HONS) (INTERNET ENGINEERING AND CLOUD COMPUTING)
EC 3333 IECC PROJECT II
Secured File Sharing with encryption and data hiding
Name: MOHAMADU NASHAN MOHAMED FAHIM
Student ID: 00014038
Supervisor: DR ABBAS MEHDIZADEH
Submission date: 12/8/2019
This project is submitted in fulfillment of the requirements for Bachelor of Information Technology (Hons) (Internet Engineering and Cloud Computing), Nilai University
2
SUPERVISOR’S DECLARATION
I hereby declare that I have checked this project and in my opinion, this project is adequate in terms of scope and quality for the award of the degree of Bachelor of Information Technology (Hons) (Internet Engineering and Cloud Computing)
Signature : .
Name of Supervisor : .
Position : .
Date : .
3
STUDENT’S DECLARATION
I declare that this report entitled “Secured File Sharing with encryption and data hiding” is my own work except as cited in the references. The report has not been accepted for any degree or diploma and is not being submitted concurrently in candidature for any degree or other award
Signature : .
Name : .
ID Number : .
Date : .
4
Acknowledgment
First of all, I like to express my sincere thanks to my Head of School Ms Halina Harun who allow me to do this project. Besides that, I would like to thank my supervisor Dr Abbas Mehdizadeh who allow me to take this secured file sharing with encryption and data hiding project under his supervision. Both of the lecturers guide me and advise me on my project which helped me to complete this project on time. I also thankful because I have learned how to write a proper research paper from attending this project class.
Furthermore, I would like to thanks all my lecturer who taught me during my university days, which help me a lot in completing this project successfully. Finally, I also thankful to all of my colleagues and friends who encourage me to do this project and help me during this project.
5
Abstract
File sharing is a technique of sharing data, messages and files between users. Nowadays many file sharing applications are available to share file with cloud computing platform. Data hacking and data leakage is an important security problem in file sharing where files are being leaked without the knowledge of file owners from data owners’ side or from sever side. The most affected parties by this problem are cooperate companies, medical industries and government organizations. The New Straight Times analysis shows that data leakage cases in Malaysia has been increase which leads personal data of internet users are being hacked and used by unauthorised person. The main reason to care about this problem is because most of the users did not actually know about their data leakage, without their knowledge data are being hacked by others. Methods such as encryption and data hiding are being implemented in file sharing systems to secure data which explained in the literature review below. The result of conducted research shows that most file sharing applications did not provide security in user side which is the main reason for data leakage (Xue, 2019). In this project, a secured file sharing application is implemented with encryption and data hiding techniques which will secure user side as well as the server side by splitting the cover image into two pieces. By implementing this system only authorized persons can access the data and server side will never have access to any data. As a conclusion data leakage can be reduced.
6
Contents
SUPERVISOR’S DECLARATION .................................................................................................... 2
STUDENT’S DECLARATION ........................................................................................................... 3
Acknowledgment ................................................................................................................................... 4
Abstract .................................................................................................................................................. 5
List of figures .......................................................................................................................................... 8
Chapter 1: Introduction .......................................................................................................................... 9
1.0 Introduction .................................................................................................................................. 9
1.1 Problem statement .............................................................................................................. 11
1.3 Objectives ............................................................................................................................. 12
1.4 Scope ........................................................................................................................................... 12
1.5 Summary ............................................................................................................................... 13
Chapter 2: Literature Review ............................................................................................................... 13
2.0 introduction ................................................................................................................................ 13
2.1 Data Hiding technique ................................................................................................................ 15
2.1.1 Lossless image encoding data hiding .................................................................................. 16
2.1.2 Reversible data hiding ......................................................................................................... 18
2.2 Discussion ................................................................................................................................... 20
2.3 Encryption ................................................................................................................................... 21
2.3.1 Identity-based encryption ................................................................................................... 22
2.3.2 File encryption attribution and deletion based ................................................................. 23
2.3.3 Discussion ............................................................................................................................ 25
2.4 Summary ..................................................................................................................................... 25
Chapter 3: Research Methodology ...................................................................................................... 27
3.1 Introduction ................................................................................................................................ 27
3.2 Method of Encryption ................................................................................................................ 31
3.3 Method of data hiding ............................................................................................................... 32
Chapter 4: Project Methodology ......................................................................................................... 33
4.1 Introduction ................................................................................................................................ 33
4.2 Requirement analysis ................................................................................................................. 34
4.2.1 Hardware requirements ...................................................................................................... 34
4.2.2 Software requirements ....................................................................................................... 34
4.3 Designing phase .......................................................................................................................... 35
4.3.1 Main user interface ............................................................................................................. 35
7
4.3.2 Use Case Diagram ................................................................................................................ 37
4.3.3 Class diagram ....................................................................................................................... 38
4.3.4 Interface layout out............................................................................................................. 39
.......................................................................................................................................................... 40
.......................................................................................................................................................... 40
4.4 Coding ......................................................................................................................................... 41
4.5 Testing ........................................................................................................................................ 49
4.5.1 Test results for Basic file sharing ........................................................................................ 49
4.5.2 Test results for Normal file sharing with current encryption method .............................. 50
4.5.3 Test results for Enhance file sharing ................................................................................... 52
4.6 Summary ..................................................................................................................................... 53
Chapter 5: Results and discussion ....................................................................................................... 54
5.1 Introduction ................................................................................................................................ 54
5.2 Current data hiding .................................................................................................................... 54
5.2 Enhanced data hiding ................................................................................................................. 57
5.3 comparison graph ....................................................................................................................... 59
5.5 Summary ..................................................................................................................................... 59
Chapter 6: Conclusion .......................................................................................................................... 60
References ............................................................................................................................................ 61
8
List of figures
Figure 1: Lossless image encoding data hiding (Khelifi 2018) ............................................................... 17
Figure 2: Proposed cloud platform model ............................................................................................ 17
Figure 3: Proposed cloud model (Chen, 2018)...................................................................................... 19
Figure 4: Reverse data hiding (Chen, 2018) .......................................................................................... 19
Figure 5: Identity-based encryption (Huang, 2018) .............................................................................. 23
Figure 6: Secure encryption with deletion (Xue 2019) ......................................................................... 24
Figure 7: Flowchart of the system ........................................................................................................ 29
Figure 8: Method of encryption ............................................................................................................ 31
Figure 9: Method of encryption ............................................................................................................ 32
Figure 10: Waterfall model ................................................................................................................... 33
Figure 11: Interface for user login......................................................................................................... 35
Figure 12: Interface for Main menu activity ......................................................................................... 36
Figure 13: Use case diagram ................................................................................................................. 37
Figure 14: Class diagram ....................................................................................................................... 38
Figure 15: Entity relationship diagram .................................................................................................. 38
Figure 16: Screen design (Login) ........................................................................................................... 39
Figure 17: Main Menu ........................................................................................................................... 39
Figure 18: Dashboard for shared file .................................................................................................... 40
Figure 19: Database design Firebase .................................................................................................... 40
Figure 20: Implementation code for application in Firebase ................................................................ 41
Figure 21: File upload code ................................................................................................................... 42
Figure 22: Storing uploaded file in database ........................................................................................ 42
Figure 23: Access phone memory ......................................................................................................... 43
Figure 24: Permission to access storage ............................................................................................... 43
Figure 25: Encryption algorithm ........................................................................................................... 44
Figure 26: Encryption algorithm ........................................................................................................... 45
Figure 27: Setting data hiding for 2 images .......................................................................................... 45
Figure 28: Storing file into first image file ............................................................................................. 46
Figure 29: Splitting file into two ............................................................................................................ 46
Figure 30: Storing file into second image file........................................................................................ 47
Figure 31: Save both images into database .......................................................................................... 48
Figure 34: Cover image file ................................................................................................................... 54
Figure 32: Encoded secret image .......................................................................................................... 54
Figure 33: Secret Image ........................................................................................................................ 54
Figure 35: Decoded secret image in first bit ......................................................................................... 55
Figure 36: Decoded image in second bit ............................................................................................... 56
Figure 37: Secret image ........................................................................................................................ 57
Figure 38: second Cover image ............................................................................................................. 57
Figure 39: First Cover image ................................................................................................................. 57
Figure 40: Encoded secret image 1 ....................................................................................................... 57
Figure 41: Encoded secret image 2 ....................................................................................................... 57
Figure 42: Decoded secret image ......................................................................................................... 58
Figure 43: Decoded image .................................................................................................................... 58
Figure 44: Comparison graph ................................................................................................................ 59
9
Chapter 1: Introduction
1.0 Introduction
In this modern world file sharing is an important application system which is needed by everyone for daily usage. File sharing is a method of storing, sharing, transferring or providing access to files between two or more users mainly between sender and receivers or known as client and server in computing environment. In everyone’s daily life they always need to share or store files such as images, videos, notes and other important documents with others. Rather then, meeting up the file receiver in real time, the sender can send any file to the receiver without meeting up them which is by using file sharing system. In governments they always need to share and store records with file sharing system for their future use or as a record in future. Besides that, in medical industries, they always need to store patient information and patient diagnose details in a file sharing system for them to refer in future. In education also, file sharing system plays a very important role which benefits the students and lecturers as well. Nowadays most of the educational institute uses file sharing system. For example, lecturer gives some online tasks and ask the students to submit it in online. So, the students will be able to do those tasks from anywhere and can submit it anytime by online. This kind of file sharing system will be more efficient in education system, since the given tasks can be completed from anywhere and reduce cost.
In early 1978s the first file sharing system was done by sharing physical devices such as storage drives (Yeadon 2016). This requires the sender and receivers to meet up in real time to exchange storage devices which will consume time to share a single file. Imagine the sender at one state and receiver at another state, they required to meet up in real time to share their device in order to share one file. After sharing of devices in 1978s for file sharing, file sharing system was expended in early 2000s. In year 2000s the efficient file sharing was introduced with certain protocols such as File transfers protocol with security. (FTPS) which allows users such as client and server to share files between them in an efficient way without meeting up in real time. After years mobile phones become an essential device for file sharing because it is portable and easy to use and mostly everyone uses mobile devices in this era. Mobile users start to use their mobile devices to share file directly from the device apart from calling and texting (Usman 2017). Even though it is easy to use mobile devices to share file it has shortage of storage. Since mobile phones comes with small memory capacity this shortage of memory
10
issues was addressed. To overcome this problems file sharing is being implemented with cloud computing platforms where it has high storage capacity for free and can be operated from anywhere and also can retrieve the file anytime with any devices without sender and receivers meet up in real time (Usman 2017).
There are many cloud providers offers free file sharing via cloud platform such as google drive, one drive, Dropbox and etc. However, many researchers indicate that file sharing via cloud platforms has security concerns such as hacking attacks and data leakage without the knowledge of file owners (Xu, 2016). Usually file owners who are the one initially uploads some files, actually don’t know that someone else can look into their files from server side by hacking the server. This type of attack is known as hacking attack where third parties hack servers to look for others personal information.
Secondly, files also can be leaked by these hackers to other. For example, when a hacker got some important or valuable files such as bank details or owners’ personal stuffs, they can leak those files to others with a huge amount of money. Mostly file owner will never know that their files are being leaked by someone. This type of attack is known as data leakage. To overcome these security concerns few techniques such as encryption and data hiding was introduced in file sharing (Yao, 2016). By implementing encryption and data hiding techniques the original file format will be converted to a ciphertext format where this ciphertext only can be read with a decryption key. Over the years many methods were proposed by researches to protect shared data in cloud environment which is explained in the literature review. Each of the proposed methods has its own pros and cons.
To have a secure and efficient file sharing platform the security breach must be strong and trustable (Xu, 2016).
This secured file sharing system is implemented with encryption and data hiding. The main aim if this project is to encrypt a file with encryption and hide it with an image files before sharing it with receivers and server.
11
1.1 Problem statement
Nowadays there are many available file sharing applications which offers free cloud storage services to clients whereby clients can send and receives file from anywhere and anytime without worrying about storage capacity. The major problem in nowadays file sharing system is, that the file sharing application providers are focusing on ease of the application use and user friendliness of the system and the providers gave less attentions to the file safety or security of file in users side (Stuart, 2016). This means that, the current file sharing systems are well developed, very easy to use but the system doesn’t care about the security of file. Many companies face the issues of data loss and data leakage which leads the company’s personal data was abused by unauthorized users (Xue, 2019).
Furthermore, even though the file is safe in the client side or file is safe while sharing, in some case the file can be viewed or hacked by unauthorized person from files server side (Gonzalez, 2019). For an example, when a file is stored in server by the file owner, it will be stored in a storage bucket in server. Each file sharing users will get individual storage buckets on the server as a storage for their file. So, imagine what will happen if the admin of the file sharing system opens any storage bucket, the admin will be able to access all the stored and shared file by the client. Even tough if the admin didn’t leak the files, all the private and confidential files of the file owner can be read or view by unauthorized access which breaks all the privacies. Besides unauthorized access by the admin, hackers and sniffers also can hack those file storage buckets to steel or leaks files. The most affected parties by this unauthorized access, file leakage and file hackings are everyday file sharing users, companies and many government authorities including medical industries.
Solution or the goal to improve this problem is by encrypting and hiding those files before uploading them into storage buckets. So, each time anyone of the users wants to upload or share some files, the file should be encrypted and hide with a cover image file and the cover image file should be split into two pieces. In this case each piece will contain some parts of the file and system required to identify matching pieces and integrate them in order to access a file. When any unauthorized want to attack the system in order to get a file, those attack will be failure since they need 2 pieces of images and in order to integrate the images, they required keys which is only available within the file owners. But unfortunately, the current file sharing application providers did not include this method in their file sharing system. In the current file
12
sharing system after encrypting a file, the encrypted file will be cover by an image file and then upload to the server. So, it will be easy and great chance for the hackers or sniffers to hack the file since one image is equal to one file.
In this secured file sharing system, a file sharing application with encryption and data hiding to secure the file is implemented. By this method, the files will be secure and unauthorized access cannot be able to read, view or leak the file without file owner’s knowledge since each file will have 2 pieces of image file and integration keys only available within the file owners.
1.3 Objectives
This research embarks on the following objectives:

1. To create a file sharing application with android studio
2. To increase the security in file sharing with encryption and data hiding
   1.4 Scope
   This application should be able to share files between users using encryption and data hiding techniques in order to solve the problems mentioned above. The scope for the system is mentioned below.
   The scope of this system is:
   • To store files in server with an android application
   • To share files such as images, videos and other important documents between users
   • To encrypt the files with an encryption algorithm before upload the files into server or storage bucket
   • To hide the encrypted files with data hiding technique and cover image file
   • Finally store 1 file in 2 cover image files with data hiding before uploading to storage bucket in the server.
   13
   1.5 Summary
   In summary, this secured file sharing system uses encryption and data hiding methods to securely share and store files between users and securely store them in a storage bucket in the server. The encryption and data hiding techniques will be implemented on client side. All the users will be able to use this system in android mobile phone.
   Chapter 2: Literature Review
   2.0 introduction
   End devices such as mobile phones and laptops plays a very important role in everyone’s daily life. Apart from doing personal stuffs with this end devices, mobile phone users also using mobile device for file storing and file sharing with other users. Available applications for mobile users to share file are google drive, one drive, dropbox and others. As per Cisco analysis the number of users use mobile device to share data has been increase to 64 percentage in the year 2014, which shows that mobile users are willing to use mobile devices for file sharing since it is portable, easy to use and free to use (Usman 2017). Nowadays file sharing can be done from anywhere, anytime and highly available with the end devices which uses cloud computing with a higher storage capacity provided by the application providers for free and instantly users can receive those share file with mobile devices. Senders and receivers can share file without meeting up in real time.
   Even though this method is fast, easy and reliable, it has some major security concerns which leads to privacy breaks (Ahmad, 2016). When users share something via cloud platform to some receivers, the server side or the cloud service provider will be able to access the data since it is a free application to use. In most of the free file sharing applications only the URL of shared files will be encrypted in order to secure them from hackers but the file will be openly available to the service provided from the storage bucket. Furthermore, attackers or sniffers can sniff the data or file while transferring online (Ahmad, 2016).
   14
   In the global market there are so many cases that the file sharing applications has leaked some personal data and file of users without the knowledge of file owners. Data leakage means a data is being read, modified or even deleted by untheorized person who is also known as attackers or hacker without the knowledge of the data owner. Many methods and techniques to overcome this problem was proposed by researchers such as, data hiding and encryption techniques. In this implemented secured file sharing system, both encryption and data hiding methods was used to securely share and store files between users. Data hiding and encryption will be explained below with some example.
   15
   2.1 Data Hiding technique
   Before upload some files to a unknow server, the files should be secure, only the authorized users should be able to access or modify those files from server. To ensure this security, data hiding technique was introduced. Data hiding is a technique of hiding or covering secrete data or file from strangers or any unauthorised users. In this technique the original data will be hide under a cover file which can be a media files such as cover image. Security issues such as hacking can be reduced when data is hide inside a media file because it is hard to predict the exact bit of file within the cover image and hackers never have a knowledge that cover image contains a file (Suresh, 2012). Moreover, data hiding is totally different from file encryption. Even though both encryption and data hiding techniques are aimed to secure data before uploading to server, both has different features. In data hiding firstly a bitmap formatted image will be chosen as a cover image. Data hiding can only support bitmap image format, if the image is not in bitmap format, then the system will convert the image into bitmap image in order to proceed with data hiding method. Next after the image is converted into bitmap format, the file owner can choose which file they want to share or upload into the server. Once the file is selected, this data hiding algorithm will generate a data hiding key. The original file will be compressed into the cover image and the cover image will be secured by the generated data hiding key. Once this process is done, nobody will know that, the cover image contains some file, even the server side will never have a knowledge that the cover image contains files. By implementing data hiding techniques hackers or attackers cannot be able to predict whether the cover image is a normal image or contains some file. There are many ways to hide data inside a cover images such as lossless image coding, encrypted halftone image. Each of this method will be discussed below.
   16
   2.1.1 Lossless image encoding data hiding
   One of the above-mentioned data hiding technique is lossles image encoding. Khelifi 2018 indicates that secure data sharing and data hiding inside a cover media file such as image file using lossless image coding. Lossless coding is a compression method in which it can hide data or file with a cover image file and the covered file can fully reconstruct from the compressed data without any changes in bit number. So, from this method, the original data can be fully restore without losing any bits or pixels of it. The author mainly focuses on increasing the space to hide data inside image. The main aim of the author to focus in this is because, some larges files can’t be able to hidden with a cover image.
   The main advantage of this proposed system is that large number of data or files can be store inside a cover image file and users also can add additional data or file after the file is encrypted. In many other data hiding methods, the system will never allow the users to add extra bits after a file is encrypted, but in this method, it allows users to add additional bits even after a file is encrypted.
   In this method as shown in figure 1 below, firstly a space will be created for data in the cover image file using image coder and image file will transmit by bit stream. Once the image is transmitted, it will be shuffled using a shuffling key in which the bits of the files will be shuffled and rearrange the order of bits to ensure security. When the original bits are rearranged by the system in different orders, it will be harder to restored into its original order for any users or hackers, which increase the security of file. After that, the image will be encrypted using a secret key and data or file will be added to the image and image will be store in server side for the receivers to extract the original data. If the sender wishes to add any other data or file into the same image, then the sender can add those additional data using a data insertion key. This proposed file sharing system uses cloud computing so many users will be able to use the system from anywhere. The model of proposed cloud computing is shown in figure 2 below.
   As a conclusion from the article, the higher the compression rate, more data can be stored inside image. Compare to other method by implementing this method in file sharing it will provide a chance where users can add additional information to the same image file after encrypting. (Khelifi, 2018)
   17
   Diagram above shows the proposed cloud computing model of the system clearly shows that, only authorized users can access the data. All users of this system will be connected one cloud computing service and the file owners can select the receivers accordingly.
   Figure 1: Lossless image encoding data hiding (Khelifi 2018)
   Figure 2: Proposed cloud platform model
   18
   2.1.2 Reversible data hiding
   Bing Chen 2018 conducted a research on data hiding inside a cover image using reversible data hiding method. RDH is a method which recovers the cover image securely after hiding the data, which means the imaged used as a cover image will be securely recovered and cover image will be securely stored. In general file owners such as senders or receivers are not willing to shows their personal file to service providers or server side. File owner even securing their cover file which contains hidden data. So, in this proposed method the author proposed RDH using encryption which can be used in cloud computing environment. The cloud model is in shown in figure 3 below.
   In this method an image file will be encrypted using homomorphism key. Homomorphism encryption is a technique of converting meaning full data into meaningless text which is known as ciphertext and add some redundant bits before decrypting the data or file to its original form. In this proposed method as shown in figure 4, the file owners or any authorized users will encrypt a cover image file using homomorphism key to make sure that the no one understand the cover image file by adding some redundant bits. Once image file is encrypted data hider or the data owner will encrypt a message with a data hiding key and insert the encrypted message inside the cover image file and upload the file to server. The server side will receive the image file which contains file, but no one will have a knowledge about that. Next the receiver of the file can decrypt the message using a data hiding key and extract the secret message contained within the cover image file. Finally, the cover image file can be recovered using a decryption key if needed by the receiver to get the original file.
   The main advantage of this system is that both the cover file (image file) and the original data are encrypted using different keys. In this method the server side will never know that the image contains a secret file. Compare to the first method in this method once after receiver decrypted the image file, the receiver still needs a secret key to extract the hidden data. The main aim of this proposed system is to increase the security of cover image file and secret message, this type of method can be used in military, medical and governments to share secret data (Chen, 2018) since even cover files are important for them. The disadvantage of this proposed system is that, only limited number of files can be add into an image file. As compared to lossless image coding, in this system only limited number of files can be added.
   19
   Diagram above shows the flow of this proposed cloud model is, file will be encrypted and upload to cloud storage bucket by the file owner. If the file owner wise to share the file with other users, the receiver of the file must be authorized by the file owner. Once a success authentication receiver can download the shared file by the file owners. Finally, files need to be decrypted with a proper key.
   Figure 3: Proposed cloud model (Chen, 2018)
   Figure 4: Reverse data hiding (Chen, 2018)
   20
   2.2 Discussion
   The main focus of both lossless images encoding and RHD methods are to secure data inside a cover image file. Both methods are used to securely share and store data without the server’s knowledge that files are hidden inside a cover image file. The main use of lossless image encoding is to compress image file to create more free space for secret data or files and hide those files within a cover image file for a secure file transfer between sender and receiver using cloud computing environment. In this method file owners can add more file even after the image file is encrypted since it creates free spaces for files inside the cover image. Next, RHD method is mainly proposed to ensure security of cover image file in server side using secret key but this method mainly focusing on recovering the cover image file after encryption. The main aim of the author to propose this RHD is to secure the cover image file and recover it after file is received by the receivers. This secured file sharing project focus on lossless image encoding. The main reason to focus this method is because in lossless image encoding more data can be inserted inside the cover image file and this method mainly gives attentions to the security of the data or secret message inserted in the image file but in RHD method attention is given to the cover image file more than the data. Even if cover image file are not recoverable or not secure data inserted inside the cover images must be secure, so this project will focus on lossless image encoding.
   21
   2.3 Encryption
   Encryption also a method which secure data and files like data hiding technique. Encryption is a method of converting the original meaning full data, message or files into a ciphertext which is meaning less data where others cannot read and understand the ciphertext without a decryption key. In encryption methods all users will have 2 keys, basically known as encryption key and decryption key. Encryption keys is the initial key used by the file owners to secure the message into a ciphertext format and decryption keys is used to recontract the ciphertext format to the original message format. There are two-basic type of encryption such as symmetric encryption and a-symmetric encryption. In symmetric way of encryption also known as secret key encryption, it uses only one key to encrypt and decrypt the message which called as a secret key. Once data is encrypted with a secret key by a user in symmetric encryption, the same secret key must be shared with the receiver of the file in order to decrypt the ciphertext and to get the original file. This way of encryption is less secure because the secret key need to be share along with the data, if any hacking attack happened the data and keys can be hacked in which the attackers can decrypt the message easily. In a-symmetric way of encryption the file will be encrypted with a public key and can be only decrypt with selected receiver’s private key which only available with the receiver. All users can share their public keys between other users, since it is needed to encrypt files and users’ private keys cannot be shared with anyone. The encrypted file by the public key is only can be decrypt with private keys, so if any users share their private keys, unauthorised users can easily access their encrypted files. To ensure security of data or file all shared and stored data must be encrypted (Guo 2018). There are many ways to encrypt data with encryption such as identity-based encryption and encryption with deletion. This proposed system is focusing in a-symmetric way of encryption because it is more secure and the encryption and decryption keys are no need to be shared with anyone (Yogesh, 2011). The literatures of a-symmetric encryption are discussed below.
   22
   2.3.1 Identity-based encryption
   Huang 2018 conducted a research on secure encryption system for data sharing in social platforms using identity-based approach. Identity based approach is a technique of encryption where file owner encrypts a message and share the ciphertext with selected multiple users at a time on the server. In this proposed method to ensure security the ciphertext will be re-encrypt again and again after a receiver decrypt the message. The encryption round will keep re-encrypt the ciphertext, so that no one can assume the ciphertext. The main advantage of this system is that only chosen parties can access to shared data and file will be re-encrypt after each decryption.
   In this method as shown in figure 5, when users want to encrypt a file an authority called key generator will create private keys for encryption. This key generating authority considered as a trusted authority by the users of this system. The authority will give keys only to users, when they request to store a file or share a file. Once users got a encryption key, they can encrypt the file by the keys. Then file owners will select the file receivers and store the encrypted data in the server as a ciphertext form. The server-side cannot be able to open the file since it is encrypted and the keys are not available in the server. Now the selected receivers can decrypt the message with a key which will be generated by key generator, the decryption keys only will be generated once the file owner selects the receivers. Once the receiver decrypts the file, the receivers can re-encrypt the file again with a private key to ensure safety and upload it again in the server for the other authorized users to use. File receivers also can select accessors to the file were the re-encrypted ciphertext will be received by the file accessors and that accessors can only decrypt the ciphertext without re-encryption it.
   In this method file sharing can be done securely because the encryption and decryption keys will be generated only by a trusted authority. Moreover, the decryption keys are only generated when file owners select the receivers of file. Finally, after each decryption users can re-encrypt the file again, so the ciphertext will change always when users re-encrypt it and unauthorized person cannot access the file.
   23
   2.3.2 File encryption attribution and deletion based
   Liang Xue conducted a research based on secure file with attribute base and file deletion. Deleting data after encryption is important in cloud computing because from the deleted bits of a data it is possible for the unauthorized person to recover and break encryption. From the deleted bits of data or file also unauthorized users can restore the original file. In this research the researcher introduced a deletion key which will change the ciphertext bits before proceed with deleting the file by adding some redundant bits, the process diagram for the method is in figure 6 below. By implementing this system file owners can surely trust the server because server side will never get the file even after deleting the file. Nobody can reconstruct the file even after deleting it.
   Firstly, data owners will upload the file to system and encrypt it with a private encryption key will be generated by a trust authority. Trust authority can be considered as a trusted user who will generate keys for sender and receiver in this system. Once after file is encrypted by the file owner the encrypted file will be stored in the server or cloud platform for the receivers to access or download the file. After storing file in the server, the decryption keys will be passed to the receiver of the file to decrypt the file.
   Figure 5: Identity-based encryption (Huang, 2018)
   24
   Decryption keys will be only passed once users select their receivers. Once the receivers got the key from the key generator, they can access the file given by the file owner by using the decryption key. If the data owner or the owner of the file wish to delete any stored file from the server they will request to trust authority to generate a deletion key and with the deletion key the users can delete the selected file. This deletion key will add some extra bits in the ciphertext and reconstruct the bits before proceed to delete. So, the server side will never get any information about the deleted file or even any bits of the file. Once deletion is complete the proof of deleted file will be sent to the data owner. This system can increase the security of file sharing on the server side.
   Figure 6: Secure encryption with deletion (Xue 2019)
   25
   2.3.3 Discussion
   Both encryption methods identity encryption file encryption with deletion discussed in the literature review uses a-symmetric encryption which uses public and private keys in order to secure the file. Both proposed systems focus on security of shared files. Identity based encryption mainly focus to secure the file and share it with multiple users and re encrypt the ciphertext when necessary. File encryption with attribution and deletion based mainly focus on file security after deleting it from the server side. In this both encryption methods senders and receivers of file no need to share any encryption and decryption keys between them while sharing the file. This secured file sharing application will focus on identity-based file encryption. The main reason to choose this method is because this method mainly focuses on safety of file in server side and files can be securely shared to a group of users at a time. To ensure the safety of file this method uses a trust authority to generate the keys. So only selected users can access the file. Moreover, if necessary, users can re encrypt the ciphertext.
   2.4 Summary
   Both encryption and data hiding technique mainly used for securing a file or secret data from unauthorized users. In encryption method the normal files or data will be encrypted using a key into a ciphertext form which cannot be understand by anyone without decrypting it.
   Normally encryption will change the characters of secret data into different character and add some extra bits to the secret data, which makes no one to understand the ciphertext without decryption key. Even though no one understand the ciphertext it will be visible to everyone in the server. But nobody can access, read or alter without decrypting it. However, data hiding is a technique which uses cover media files such as image or video files to hide normal file. This method is simpler compared to encryption, since data hiding is just hiding any secret data or file under a cover image file using bitmap format images.
   In data hiding technique the normal files will be not visible to anyone. Unlikely encryption, in data hiding files will be not visible to anyone in the server. Server side will receiver only a cover image file, but no one will have knowledge that the cover image file contains secret data or file. For this project both encryption and data hiding techniques will used. The current
   26
   encryption algorithm will be used without any changes in the algorithm. For data hiding method, the algorithm will be changed as a contribution from the author. The algorithms will be explained below in chapter methodology. Table below shows the advantages of each techniques.
   Methods
   Techniques
   Advantage
   Encryption
   Identity based encryption
   Re-encrypt files after each decryption
   File encryption attribution and deletion based
   File can be securely deleted
   Data hiding
   Reversible data hiding
   Large number of data can be store in side an image
   Lossless image encoding data hiding
   Secure cover file
   27
   Chapter 3: Research Methodology
   3.1 Introduction
   In this chapter the methodology of secured file sharing is discussed briefly. For this secured file sharing application both data hiding and encryption techniques will be used which was explained in the literature review. The main reason for using both methods are to increase the security of file sharing. For data hiding technique lossless image encoding will be used because lossless image encoding is a technique which can compress data and hide it with a cover image file without changing the original bit of the file. Another reason is in this method number of files can be stored inside an image file. Moreover, server side will have no knowledge about the secret data inserted inside the cover image file.
   For encryption identity-based encryption will be used because in identity-based approach file owners can encrypt the file and can share the ciphertext of file with multiple users at a time and the decryption keys are no need to be shared between users. Advantage of this method is that only receivers of the file will have the decryption key and the server side will never have any access to the file. Moreover, this method uses a-symmetric way of encryption which means the file can be encrypt with a public key and can be decrypt with a private key. The private keys can be kept within the users always without sharing it.
   Encryption method will be fully used from encryption library without any changes. For data hiding technique the current algorithm for lossless image encoding will be enhanced. In data hiding currently one file is hidden in only one cover image file but in this project one file will be hidden inside two image files. The main reason to insert one file in two cover images are to increase the security which will cause difficulty to extract the hidden data within two cover files. When one file is inserted into two image, receivers or others required the both images in order to access the file. In this case unauthorized users will not be able to access the file, since in the database there will be multiple images for one file. Even if anyone tries to hack or attack the files, they not might get those exact files. Furthermore, if any one of the cover image files is deleted the users cannot get the full complete hidden file.
   28
   The measurement the author wants to measure in this project is the difficulty in extracting data, which means how difficult is to extract the hidden data from this system. In order to measure the difficulty of this system, this system will be compared with current data hiding system. So, both systems will be hacked by a decoder to measure the security and results are recorded and explained in results and discussion chapter.
   This system is fully based on java programming. The platform used is android studio. For database firebase system is used. The main reason for using firebase is because android studio has its own firebase. The measurement for this project will be recorded based on database analysis. This system has three phase such as Basic file sharing, normal file sharing and enhanced file sharing. Basic file sharing is the simplest version which don’t have any security while sharing the file or uploading. Normal version is based on the current file sharing technique used nowadays. Lastly Enhanced version is the file sharing which was encryption and enhanced data hiding technique in it. The reason to have three different versions is to check how files are transferred in each version.
   Diagram below shows the flow of this system.
   29
   Figure 7: Flowchart of the system
   30
   This system starts from user login where data owner’s login into this system with the valid username and password. Once data owners logged into this system, they can upload files to this system. The file can be any document formatted file, image file, or audio file. Next the process of encryption will take place. This system will use identity-based encryption as mentioned previously. The process of encryption is discussed in figure 8 below. The next process after encryption is data hiding. As discussed in literature review lossless image encoding will be used to hide the data inside an image file. In the process of data hiding one file will be store inside 2 cover images file which is the main focus and contribution on this system. The process of data hiding is discussed in diagram 9 below. Once data hiding process is done the cover images file will be uploaded to the server and the server side will never have any knowledge on the data inside the over image. Next the data owner can select any receiver for the file and cover images will be shared with the receivers. In the final step the receivers have to extract the secret file from the cover image file and decrypt the file with their own decryption key.
   31
   3.2 Method of Encryption
   The encryption method used in this secured file sharing application system is a-symmetric based encryption, the main reason to choose this encryption method is because it is more secure then symmetric encryption and another reason is in in a-symmetric encryption the encryption and decryption keys are no need to be shared or store because each user will have their own public and private keys. The encryption algorithm will not be change from the previous methods, the existing technique will be used fully. The encryption will take place in client side, instead of sever side. The reason to encrypt in client side is because server side will never get the encryption knowledge and how the encryption method works for this system. The encryption algorithm will encrypt the file and also the URL of the appropriate file. The reason to encrypt the URL is to protect the file from man in the middle attack, since man in the middle attack is mainly used to extract the URL of file from server side. First of all, encryption will take place once file is uploaded to the system by any of the users on client side. File format can be any format such as document file, pdf file or image files. Once file is uploaded the system will encrypt the file with an encryption algorithm and an encryption key then the ciphertext for the file will be generated after the encryption. Once the ciphertext is created, the system will continue with data hiding technique before upload it onto the server. The method for data hiding is explained below.
   Figure 8: Method of encryption
   32
   3.3 Method of data hiding
   In this data hiding technique image files will be used as cover file to hide the original data or files. The cover image files will be only bitmap format since data hiding technique only support bitmap format. Data hiding also will take place in client side before uploading to the server or storage bucket. First of all, once any file is encrypted, the ciphertext will be encoded with data hiding technique in which the file will be covered by image file. So, the server side will never have any knowledge about the file inside the cover image. The cover image will be selected automatically by the system to ensure security without letting the users to choose any pictures. Firstly, lossless image encoding will compress the file without changing any bits of the file. This is to make sure that the file can be inserted inside the cover image file. Next, once cover image file is selected by the system, the cover image files will be shuffled with LSB. LSB refers to the least significant bits of image file. When cover image files are shuffled data insertion will be easier because more spaces will be created by the image to store data or files. After completion of image shuffling, the ciphertext of the appropriate file will be insert into cover image file, then the image will be split into 2 cover images files, so each file will have 2 pieces of cover images. In the current methods of data hiding one file will be hide under one over image, but in this system one file will be hide under two cover image files. The reason for splitting the cover image into two piece of cover images is, because on server side for each file there will be two images where the server doesn’t have any knowledge that to get one complete file, they need to decrypt two images. Another reason is apart from the server, attackers or sniffer also don’t have any knowledge about the hidden files inside two images. Finally, hidden image file will be stored in the server for the receivers to access. Receivers can decrypt the image file with their decryption key which will be generated in the user side. In the final step both images will be stored in the server for the receivers to access.
   Figure 9: Method of encryption
   33
   Chapter 4: Project Methodology
   4.1 Introduction
   The model that can be used in this secured file sharing system is waterfall model. Since the system is considered to be small, because its main purpose it to securely share files between client’s, so waterfall model will be suiting this system. In waterfall model the stages to develop the system is simply define into 5 stages, such as requirement, design, implementation, verification and maintenance. Figure below shows the waterfall model.
   Figure 10: Waterfall model
   34
   4.2 Requirement analysis
   The software and hardware requirement for this system is explained below accordingly.
   4.2.1 Hardware requirements
3. Mobile phone with android operating system
   Since the application is developed in android studio mobile phone with android operating system is required. Users of this application can use mobile phone to send and receive files between them.
4. 2GB RAM in mobile
   2GB RAM capacity is enough to run this application on any android mobile phone platform, since the application is not too complicated.
   4.2.2 Software requirements
   i. Firebase
   Firebase is used to develop the database and storage of this system.
   35
   4.3 Designing phase
   The entire design of this system is developed in android studio. The interface for layout is developed in XML code. In this designing phase the layout of main interface, class diagram, use case diagram, entity relationship diagram and system output are given.
   4.3.1 Main user interface
   This secured file sharing application has both client and server side. Both client and server side provide graphical user interface for users. The main interfaces are explained below.
   Users are required to register for this system in order to use it. Registered users can log into this system by providing the username and password. In case if users forget their password, they will be able to change the password by clicking register button above.
   Figure 11: Interface for user login
   36
   After successful log in, users can choose either one of file sharing type, such as basic, normal or enhance. All this type will have the same main function to upload and share files, but security level will be different as mentioned earlier. After choosing a file sharing type, the above figure 12 interface will be displayed. In this interface, all the uploaded file will be displayed. From here users can share, download and delete files. Users also can upload new file by pressing the ”+” symbols.
   Figure 12: Interface for Main menu activity
   37
   4.3.2 Use Case Diagram
   Figure 13: Use case diagram
   38
   4.3.3 Class diagram
   Figure 14: Class diagram
   Figure 15: Entity relationship diagram
   39
   4.3.4 Interface layout out
   Figure 16: Screen design (Login)
   Figure 17: Main Menu
   40
   Figure 18: Dashboard for shared file
   Figure 19: Database design Firebase
   41
   4.4 Coding
   Figure 20: Implementation code for application in Firebase
   42
   Figure 21: File upload code
   Figure 22: Storing uploaded file in database
   43
   Figure 24: Permission to access storage
   Figure 23: Access phone memory
   44
   Figure 25: Encryption algorithm
   45
   Figure 26: Encryption algorithm
   Figure 27: Setting data hiding for 2 images
   46
   Figure 29: Splitting file into two
   Figure 28: Storing file into first image file
   47
   Figure 30: Storing file into second image file
   48
   Figure 31: Save both images into database
   49
   4.5 Testing
   This secured file sharing system with encryption and data hiding was tested with few types of file such as image file, document file and PDF file type to check whether, those type of files can be securely upload and download. There are three stage to check this secured file sharing system, such as basic, normal and enhance version. In each version files will be uploaded and tested accordingly.
   Table below shows the testing of each version mentioned above.
   4.5.1 Test results for Basic file sharing
   Table 1: Test result for basic file sharing
   Test case
   Scenario
   Expected output
   Actual output
   Comments
   Upload
   1)User upload PDF file type and click upload button

2) User click upload button without selecting file
3) user try to upload a film with 4GB
   File uploaded successfully on firebase with appropriate URL
   Without selecting file user should not able to upload files
   File type not support by firebase
   File uploaded successfully on firebase with appropriate URL
   Without selecting file user should not able to upload files
   File type not support by firebase
   Upload function works perfectly
   Users always need to select file and click upload button.
   System only upload documents such as image, word file or PDF.
   50
   Download
   User click download file
   File download successfully
   File download successfully
   Download function works perfectly
   Share file
   1)User share files with other users
4) User try to share file with himself
   File shared with other users and updated in firebase
   Cannot share file within yourself
   File shared with other users and updated in firebase
   Cannot share file within yourself
   Share function is working.
   Users cannot share file between themselves. Function work.
   4.5.2 Test results for Normal file sharing with current encryption method
   Table 2: Test result for normal file sharing
   Test case
   Scenario
   Expected output
   Actual output
   Comments
   Upload file with normal encryption
   1)User upload word file type and click upload button
   File uploaded successfully on firebase with appropriate URL. URL and file are encrypted
   File uploaded successfully on firebase with appropriate URL.
   URL and file are encrypted
   Upload function works perfectly with normal encryption
   51
5) User click upload button without selecting file
   Without selecting file user should not able to upload files
   Without selecting file user should not able to upload files
   Users always need to select file and click upload button.
   Download
   User click download file
   File decrypted and downloaded successfully
   File decrypted and downloaded successfully
   Download function works perfectly with decrypting the file
   Share file
   1)User share files with other users
6) User try to share file with himself
   File shared with other users and updated in firebase
   Cannot share file within your self
   File shared with other users and updated in firebase
   Cannot share file within your self
   Share function is working.
   Users cannot share file between themselves. Function work.
   52
   4.5.3 Test results for Enhance file sharing
   Table 3: Test results for Enhance file sharing
   Test case
   Scenario
   Expected output
   Actual output
   Comments
   Upload file with normal encryption and data hiding
   1)User upload image file type and click upload button
7) User click upload button without selecting file
   File uploaded successfully on firebase with appropriate URL. URL and file are encrypted and the file is hided under cover image file
   Without selecting file user should not able to upload files
   File uploaded successfully on firebase with appropriate URL. URL and file are encrypted and the file is hided under cover image file
   Without selecting file user should not able to upload files
   Upload function works perfectly with normal encryption and data hiding method
   Users always need to select file and click upload button.
   Download
   User select any available file and click download file
   File decrypted and uncovered and downloaded successfully
   File decrypted and uncovered and downloaded successfully
   Download function works perfectly with decrypting the file
   53
   Share file
   1)User share files with other users
8) User try to share file with himself
   File shared with other users and updated in firebase
   Cannot share file within your self
   File shared with other users and updated in firebase
   Cannot share file within your self
   Share function is working.
   Users cannot share file between themselves. Function work.
   4.6 Summary
   As a conclusion, in this chapter the project methodology is explained. The used methodology in this project is waterfall model, the main reason is because waterfall model is suitable for this find of file sharing application and this application can be consider as small. Besides, methodology the hardware and software required is explained and the reason to used the hardware and software also explained. Furthermore, in designing phase, the diagrams are listed to show the actual flow of this project. Screen out of main function also explained in the designing phase. In coding part, the main code used in this project is listed. All the code listed is implemented and executed in android studio with JAVA based programming.
   54
   Chapter 5: Results and discussion
   5.1 Introduction
   In this chapter the final results of this project is discussed. The results are based on the difficulty to extract the data or file from the cover image. The current data hiding technique also measured to compare the results with this data hiding technique.
   5.2 Current data hiding
   The current data hiding techniques used nowadays is hiding one secret message or file within only one cover image. Difficulty to extract this current technology is measured by image decoder which is available in online. The results of current data hiding techniques are discussed below.
   Figure 34 above shows the cover image file which will be used to cover the secret image inside it. Figure 32 shows the secret image which will be hided inside cover image. Finally figure 33 shows the encoded image which is the secret image is hided inside the cover image file.
   Now this encoded image will be tested with image decoder to measure the difficulty in order to extract the secret image contained inside it.
   Figure 34: Secret Image
   Figure 32: Cover image file
   Figure 33: Encoded secret image
   55
   When the encoded image in figure 33 decoded, the secret image within it was extracted immediately within the first bit. The reason why it extracts the secret image quickly is because only one cover image is used and the security levels are very lower in it.
   Figure 35: Decoded secret image in first bit
   Figure 35 shows the decoded image which contains the secret image within the cover image’s first bit. In the first bit, the secret image is clearly visible when decoded, which shows that, it is easy to extract secret data from cover images.
   56
   Figure 36: Decoded image in second bit
   Figure 35 shows the decoded image which contains the secret image within the cover image’s second bit. In the second bit, the secret image is not clearly visible, but still the secret image can be viewed.
   57
   5.2 Enhanced data hiding
   This enhanced data hiding technique hides one secret file or image within two cover images. Difficulty to extract secret file on this enhanced system is measured by image decoder which is available in online. The results are discussed below.
   Figure 39 and 38 above shows the cover images used to hide the secret image inside it. As mentioned above this system will have two cover images. Figure 37 shows the secret image which will be hidden inside both cover images. Figure 40 and 41 above are the encoded images which has the secret image file. The image in figure 37 has encoded into both figure 40 and 41.
   Figure 39: First Cover image
   Figure 38: second Cover image
   Figure 37: Secret image
   Figure 40: Encoded secret image 1
   Figure 41: Encoded secret image 2
   58
   When the encoded image in figure 40 and 41 decoded, the secret image within it was not extracted. the secret image within the cover images was not extracted from the cover images, which shows the security is higher in this enhanced system.
   Figure 42 shows the first decoded image on this enhanced system. In this case the secret image within the cover image file is not visible even after encoded.
   Figure 43 shows the second decoded image on this enhanced system. In this case also the secret image within the cover image file is not visible even after encoded.
   Figure 42: Decoded secret image
   Figure 43: Decoded image
   59
   5.3 comparison graph
   Figure 44: Comparison graph
   The comparison graph above shows, the difficulty in extracting the secret data based on current and this enhanced system. The results are based on the discussion above in chapter 5.1 and 5.2. the current data hiding system is not difficult to extract the secret data even in first, second and third bit. But compare to current data hiding, in the enhanced data hiding it is not easy to extract the secret image even in the first bit. The difficulty for extracting secret image is very high for enhanced data hiding system.
   5.5 Summary
   In summary, enhanced data hiding system is more secured compared to the current data hiding. The main reason is, the current data hiding systems uses only one cover image file but this enhanced system uses two cover images, which increase the difficulty to extract the secret data from cover images.
   60
   Chapter 6: Conclusion
   As a conclusion, in previous methods of data hiding one file will be hide only in one cover image file but in this secured file sharing system one file will be store in two cover image files. Each pieces of cover image files will contain the data of file. If any one piece of data is deleted from the server the file will be corrupted or users will be not able to download the file. Reason to store the file in two images are, when any unauthorized access to the server they will never know that one file will be stored in two cover image files, to get a complete file they required to integrate both cover image files. Even though if the unauthorized get both images he might need a key to integrate the images to get one complete file. This method will increase the security of file sharing. Moreover, in this system both encryption and data hiding techniques used to increase the security of file. This method can be applied in cooperate organizations, education industries, medical industries and government organizations to secure important documents or files.
   Currently this system only uses the available cover images. As a future enhancement, this system should randomly select cover image files, which mean without the user providing cover images, the system should be able to use random images from online. By randomly taking cover images, this system will be more secure and safe to use.
   61
   References
9) Chen, B., 2018. Reversible data hiding in encrypted images with private-key, p. 11.
10) Gonzalez-Compean, J., 2019. A policy-based containerized filter for secure information sharing in, p. 15.
    3)Huang, Q., 2018. PRECISE: Identity-based private data sharing with conditional proxy, p. 11.
    4)Khelifi, F., 2018. Secure and privacy-preserving data sharing in the cloud based on lossless image coding, p. 11.
    5)Kumar, A., 2010. Steganography- A Data Hiding Technique. Volume 9, p. 5.
    6)Kuma, Y., 2011. Comparison of Symmetric and Asymmetric Cryptography with Existing Vulnerabilities and Countermeasures, Volume 11, p. 4.
    7)Mali, S., 2012. Robust and secured image-adaptive data hiding, p. 11.
    8)Stuart, A., 2016. The dangers of file sync and sharing services, p. 3.
    9)Usman, M., 2017. Cryptography-based secure data storage and sharing using, p. 13.
    10)Xu, D., 2016. An improved scheme for data hiding in encrypted H.264/AVC videos, p. 14.
    11)Xue, L., 2019. Efficient attribute-based encryption with attribute revocation for assured data deletion, p. 11.
    12)Yao, Y., 2016. Inter-frame distortion drift analysis for reversible data hiding in, p. 15.
    13)Yin, S., 2016. Distributed Searchable Asymmetric Encryption, Volume 4, p. 11.
11) Khandare, P., 2014. Data Hiding Technique Using Steganography , Volume 5, p. 13.
