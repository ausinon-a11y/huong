import { Pet, RescueReport, LostFoundPet, Story, VolunteerRole, DonationPackage } from '../types';

import cpap1 from '../assets/pets/cpap1.jpg';
import cpap2 from '../assets/pets/cpap2.jpg';
import cpap3 from '../assets/pets/cpap3.jpg';
import cpap4 from '../assets/pets/cpap4.jpg';
import cpap5 from '../assets/pets/cpap5.jpg';
import cpap6 from '../assets/pets/cpap6.jpg';
import cpap7 from '../assets/pets/cpap7.jpg';
import cpap8 from '../assets/pets/cpap8.jpg';
import cpap9 from '../assets/pets/cpap9.jpg';

export const PET_IMAGES = {
  cpap1,
  cpap2,
  cpap3,
  cpap4,
  cpap5,
  cpap6,
  cpap7,
  cpap8,
  cpap9,
};

export const HERO_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0lLEmGnnKFZvIgmmBezoTPmis9BkV437ppe7OEjl9ZzQGVvOYsVqEpUSrBAoN9Q0D993iLNGyZCDDiIxrhJpl4P46hRsZMRvujVfvDhotBvAWYGo1t11qDFzNtXLzuHDWZw7z27SH8EK6FE3TNAPWIZJtUzXxik6YlApqDSXydGMUlApb0iY_APKRXiNMv5mhZrs5NAZEO1Lxly7MCMcCnTVxlBVZQM27JohB8p-8HXpn4zpZ3iXv";

export const BENTO_IMAGES = {
  adopt: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwco01sgbovFoVXPM2DzP0pyrTp2b80S2uOZH4UDpbJ98QqmsSPawmrkem-Y1tmJPXTV4TpyjpQxqMZUFBhbMhWAuMELzOqFFDa4N1VWMPWBlv3WhSfId_NFrmvyCBQ7n4ljcxqY8VyonAKfLJnhsajND-BTurMfcdv1MSzLDNUYp95FsGeIhFEX5T6yyNocwGX2py3ALkqc8AFm0Y9LYC5zlEffSS9V_zbMncRq58R6cJ1Tks1vF_",
  rescue: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS35Yictu90b8AE72PfF30L4DG4KE4sBO0uuTtJOJDIJPJR1Tp2eCSXLeu38TS1r7dkOhn9PRU99Ba-WhYwILcD5Zh21oAFMgsKp5xBV6HhxVkqzuYo-eFSze9CXd_Q6WTX-v9ogZoaIruH2MV-7uUpZuaIlQp0rBkozRd1vipMVKLFojLK82TxQ7YXOyc0PMXkd9q5ozuUKKwe8zOlEnT5dkYvZh-FiK7gRK4tUOlJpGmdjgtpyr3",
  lost: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHFB3n6FS-LWhsMW-_juykvgQ4xkFOIhJVxyuD9vk3tj8mLKYHIsAzceOz_ofC2IicvqH51ii75Ls8BmrJ4ls5jF0cglb8w7X2JosXGKyrwKqYAFf3LJ8spWIafDSHs-Sk0XvSRPQLaxBPC2T-P8iMihf_9Qkzc83vKmDT6MU995s44mD6L_vV8yy0Ua1GE585anfj6-Azf56_y3qbSBmu3_iCew1c1h6vcQ6QgXWMTpP1OBkDh5A",
};

export const INITIAL_PETS: Pet[] = [
  {
  id: 'pet-11061',
  name: 'CPAPS_11061',
  species: 'cat',
  breed: 'Mèo',
  age: 'Khoảng 3 tháng điều trị tại viện + 2 tháng tại Nhà Chung',
  gender: 'Cái',
  weight: 'Chưa cập nhật',
  size: 'Nhỏ',
  location: 'Nhà Chung của Trạm Hà Nội',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: false,
  status: 'available',
  rescueDate: 'Chưa cập nhật',

  story: 'CPAPS_11061 được Trạm cứu trong tình trạng loét thủng giác mạc, hốc mắt đọng nhiều mủ có mùi nhiễm trùng. Khi nhập viện, bác sĩ phát hiện em đang mang thai nên ưu tiên điều trị bằng kháng sinh và kháng viêm để bảo tồn mắt, hạn chế ảnh hưởng đến các bé mèo trong bụng. Sau 2 tuần điều trị, mắt em đã hết mủ và ổn định nhưng đáng tiếc em đã mất hoàn toàn thị lực ở mắt trái, mắt dần teo lại. Trong thời gian điều trị, em được theo dõi thai định kỳ nhưng vẫn xuất hiện tình trạng rỉ máu bất thường và thai có dấu hiệu dị dạng. Sau đó em sinh non, các bé mèo con đều không thể sống sót. Em tiếp tục trải qua ca phẫu thuật lấy thai và điều trị tử cung nhiễm trùng. Tổng cộng em đã nằm viện khoảng 3 tháng. Sau khi xuất viện, em còn phải được chăm sóc và ổn định tâm lý vì từng gào khóc tìm con đến khản giọng. Hiện em đã về Nhà Chung được 2 tháng, tâm lý ổn định hơn và sức khỏe cũng dần hồi phục. Trạm mong tìm được một gia đình nhận nuôi hoặc foster để em có một mái nhà riêng, được yêu thương và chăm sóc tốt hơn.',

  personality: [
    'Hiền',
    'Cần được yêu thương',
    'Đã ổn định tâm lý',
    'Cần một mái ấm yên tĩnh'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Nhà Chung - Khu cách ly',

  images: [
    cpap4
  ]
  },
  {
  id: 'pet-11099',
  name: 'CPAPS_11099',
  species: 'cat',
  breed: 'Mèo',
  age: 'Chưa xác định',
  gender: 'Chưa xác định',
  weight: 'Chưa cập nhật',
  size: 'Nhỏ',
  location: 'Nhà Chung của Trạm',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: false,
  status: 'available',
  rescueDate: 'Chưa cập nhật',

  story: 'CPAPS_11099 là một em mèo bị liệt, bị chủ bỏ lại tại phòng khám sau thời gian dài mang trên mình rất nhiều bệnh và di chứng. Vì liệt lâu ngày, hai chân sau của em đã teo cơ, vùng mông bị loét nghiêm trọng, các cơ quan nội tạng cũng bị biến dạng và em còn mắc giảm bạch cầu. Phòng khám đã điều trị giảm bạch cầu và xử lý vết loét cho em, nhưng chủ liên tục khất lần khất lượt không đến đón. Cuối cùng, chủ bỏ em lại phòng khám, nhờ tìm người nhận nuôi giúp rồi chặn liên lạc. Trong một lần điều phối của Trạm lên phòng khám thăm các bé chó mèo đang nằm viện, ánh mắt của em vô tình níu chân tụi mình lại. Thương em nằm một mình với cơ thể không còn lành lặn, tụi mình quyết định rước em về Nhà Chung. Hiện em đang được chăm sóc trong một chiếc lồng riêng cùng với hàng chục bạn mèo liệt khác của Trạm. Vì không thể tự đi vệ sinh và cần giữ vùng da luôn sạch, khô, các bé mèo liệt như em cần sử dụng bỉm lót lồng thường xuyên. Đây cũng là vật dụng cần thiết cho nhiều trường hợp đặc biệt khác như mèo sữa, mèo hoại tử hậu môn, mèo động kinh...',

  personality: [
    'Hiền',
    'Cần được chăm sóc đặc biệt',
    'Kiên cường',
    'Cần một mái ấm yêu thương'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Nhà Chung - Khu chăm sóc mèo liệt',

  images: [
    cpap1
  ]
},
 {
  id: 'pet-11106',
  name: 'CPAPS_11106',
  species: 'dog',
  breed: 'Chó con',
  age: 'Chưa xác định',
  gender: 'Chưa xác định',
  weight: 'Chưa cập nhật',
  size: 'Nhỏ',
  location: 'Phòng khám - Hà Nội',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: true,
  status: 'medical_care',
  rescueDate: 'Chưa cập nhật',

  story: 'CPAPS_11106 là một bé chó con bị người ta đánh đến mức liệt cả bốn chân, sau đó bị túm vào một túi nilon và treo ra xe rác trên phố Yên Lãng. Một bạn phát hiện em, đưa em về phòng trọ, tắm rửa và nhận thấy em hoàn toàn không thể tự di chuyển nên đã liên hệ với Trạm để báo case cứu hộ. Em được đưa nhập viện trong tình trạng đa chấn thương, phải theo dõi xuất huyết nội và chấn thương cột sống. Bác sĩ cho biết chỉ cần chạm vào nhiều vị trí trên cơ thể là em đã đau đớn kêu lên. Vì quá sợ hãi sau những gì đã trải qua, em luôn trong trạng thái phòng thủ, nhe hàm răng sữa còn chưa mọc đủ để dọa cắn bất kỳ ai muốn lại gần. Hiện em cần tiếp tục được theo dõi, điều trị và chăm sóc đặc biệt để có cơ hội hồi phục sau chấn thương.',

  personality: [
    'Nhút nhát',
    'Cảnh giác',
    'Đang cần được phục hồi',
    'Cần chăm sóc đặc biệt'
  ],

  goodWithKids: false,
  goodWithOtherPets: false,
  shelterRoom: 'Phòng khám - Khu điều trị',

  images: [
    cpap2
  ]
},
 {
  id: 'pet-11095',
  name: 'CPAPS_11095',
  species: 'cat',
  breed: 'Mèo',
  age: 'Chưa xác định',
  gender: 'Chưa xác định',
  weight: 'Chưa cập nhật',
  size: 'Nhỏ',
  location: 'Phòng khám - Hà Nội',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: true,
  status: 'medical_care',
  rescueDate: 'Khoảng 1 tuần trước',

  story: 'CPAPS_11095 được cứu hộ sau khi ngã từ tầng cao xuống lề đường Vũ Ngọc Phan vào sáng sớm. Em nằm dưới gốc cây, dầm mưa suốt cả ngày và đến đêm mới được báo tin để đưa về Trạm cấp cứu. Khi nhập viện, em bị chấn thương đa tạng, mắt đờ đẫn và có những cơn co giật do chấn thương não. Em mê man, nửa tỉnh nửa mê suốt 3 ngày. Khi tỉnh táo hoàn toàn, điều đầu tiên em làm là cố gắng xin ăn mỗi ngày như một cách tự mình giành lại sự sống. Em bị vỡ vòm khẩu cái và rách miệng nên mỗi lần ăn lại vô cùng đau đớn, thức ăn còn có thể trào ngược qua đường mũi khi em hắt hơi. Bác sĩ đã truyền máu và sử dụng kháng sinh liều cao. May mắn là em đáp ứng điều trị tốt và đủ sức khỏe để phẫu thuật khâu lại vòm khẩu cái và phần miệng bị rách. Hiện em đã tỉnh lại sau phẫu thuật nhưng vẫn còn yếu, gan chưa hồi phục hoàn toàn và thỉnh thoảng vẫn có những cơn rung lắc nhẹ do chấn thương não. Em đang chập chững tập ngồi, tập đứng và những bước đi đầu tiên sau biến cố. Dự kiến khi đủ điều kiện xuất viện, Trạm mong tìm được một gia đình nhận nuôi hoặc foster để em có một cuộc sống mới an toàn và không còn khổ đau.',

  personality: [
    'Kiên cường',
    'Ham ăn',
    'Đang hồi phục',
    'Cần được yêu thương'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Phòng khám - Khu điều trị',

  images: [
    cpap3
  ],

  specialNeeds: [
    'Đang hồi phục sau phẫu thuật vòm khẩu cái',
    'Chấn thương đa tạng',
    'Theo dõi chấn thương não',
    'Gan chưa hồi phục hoàn toàn',
    'Cần chăm sóc và theo dõi đặc biệt'
  ],

  supportMessage: 'Em vẫn đang trong quá trình hồi phục và cần thêm thời gian để khỏe lại hoàn toàn. Trạm mong tìm được người nhận nuôi hoặc foster khi em đủ điều kiện xuất viện.'
  },
  {
  id: 'pet-11071',
  name: 'CPAPS_11071',
  species: 'dog',
  breed: 'Chó con',
  age: 'Chưa xác định',
  gender: 'Chưa xác định',
  weight: 'Chưa cập nhật',
  size: 'Nhỏ',
  location: 'Nhà Chó Hoài Đức',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: false,
  status: 'available',
  rescueDate: 'Chưa cập nhật',

  story: 'CPAPS_11071 là một bé chó con từng bị chủ bạo hành. Em bị nhét vào cốp xe máy rồi đóng cốp chèn ngang người khiến xương sườn bị gãy, chọc vào phổi. Em khó thở, liên tục rít lên từng cơn nhưng không ai ở gần dám cứu vì sợ bị chủ của em đánh. May mắn là em đã chờ được Trạm tới đưa đi cấp cứu. Khi nhập viện, em sốt cao, lưỡi tím, thở khò khè và rít lên từng cơn như đang hấp hối. Sau những ngày điều trị và vượt qua rất nhiều đau đớn, em đã hồi phục và hiện sẵn sàng tìm một gia đình mới. Em vẫn còn là một bé chó con nên khá nghịch và cần được dạy dỗ thêm. Em đặc biệt thèm hơi người, nếu không được bế và ở gần người thường xuyên thì sẽ khóc rất to. Em từng được các anh chị học sinh tặng đồ chơi, nhưng vì quá thích nên tha đồ chơi ra vườn rồi gặm cả đất, sỏi, cát khiến đau bụng và nôn khan. Sau vài lần nghịch dại, em được chuyển về Nhà Chó ở Hoài Đức để phù hợp hơn với điều kiện chăm sóc. Hiện em lại đang phải làm quen với các bạn chó khác và đôi khi bị các bạn cũ bắt nạt. Em cần một gia đình kiên nhẫn, yêu thương và sẵn sàng dành thời gian dạy dỗ, chơi cùng em.',

  personality: [
    'Quấn người',
    'Thích được bế',
    'Nghịch ngợm',
    'Ham chơi',
    'Cần được dạy dỗ thêm'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Nhà Chó - Hoài Đức',

  images: [
    cpap5
  ],

  specialNeeds: [
    'Cần được quan tâm và tương tác thường xuyên',
    'Cần gia đình kiên nhẫn dạy dỗ',
    'Không nên để bé tự do gặm đồ vật ngoài trời',
    'Cần theo dõi khi chơi với đồ chơi và các vật nhỏ'
  ],

  adoptionNote: 'Bé đã vượt qua chấn thương và sẵn sàng được nhận nuôi. Phù hợp với gia đình có thời gian chơi cùng, chăm sóc và kiên nhẫn hướng dẫn bé trong giai đoạn còn nhỏ.'
},
 {
  id: 'pet-10910',
  name: 'Bi',
  species: 'dog',
  breed: 'Chó',
  age: 'Chưa xác định',
  gender: 'Chưa xác định',
  weight: 'Chưa cập nhật',
  size: 'Vừa',
  location: 'Nhà Chó - Hà Nội',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: false,
  status: 'foster_needed',
  rescueDate: 'Đầu năm 2026',

  story: 'Bé Bi là một chú chó bị liệt, từng bị người ta chôn sống tại một bãi rác ở Thạch Thất - Đại Đồng. Khi được phát hiện, em đã nằm vùi trong đống rác suốt 2 ngày 1 đêm. May mắn em không bị rác làm tắc thở và được một em học sinh đi đổ rác phát hiện rồi báo tin cho Trạm. Khi nhập viện, em trong tình trạng mất nhận thức, mất thân nhiệt, thiếu máu, suy kiệt lâu ngày và bạch cầu tăng cao bất thường. Em bị liệt do tổn thương cột sống, xương đùi và khung xương chậu có nhiều vùng vôi hóa dị dạng, cơ thể đau đớn đến mức chạm vào đâu cũng khiến em kêu. Sau khoảng 6 tháng điều trị nội trú, Bi đã dần hồi phục cả thể chất lẫn tâm lý. Em đã được điều trị viêm khớp, vật lý trị liệu tích cực, bổ sung canxi liều cao, truyền máu định kỳ và ăn chế độ giàu thịt để tăng cơ. Những tổn thương xương dị dạng vẫn còn nhưng các cơn đau khớp đã giảm đáng kể và em đang chuẩn bị được xuất viện. Bi khá lười vận động, thích nằm hơn là đứng lên tập đi, nhưng em rất cần một người kiên nhẫn đồng hành, đưa em đi dạo và hỗ trợ tập luyện mỗi ngày để đôi chân có cơ hội hồi phục tốt hơn. Trạm mong tìm được một gia đình nhận nuôi hoặc foster để những tháng ngày sắp tới của Bi không còn chỉ là những ngày nằm một mình trong lồng.',

  personality: [
    'Hiền',
    'Điềm đạm',
    'Hơi lười vận động',
    'Cần được quan tâm',
    'Kiên cường'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Nhà Chó - Khu chăm sóc đặc biệt',

  images: [
    cpap6
  ],

  specialNeeds: [
    'Liệt và có dị dạng xương',
    'Cần vật lý trị liệu và vận động nhẹ',
    'Cần chế độ dinh dưỡng hỗ trợ tăng cơ',
    'Cần người chăm sóc kiên nhẫn',
    'Cần được theo dõi sức khỏe định kỳ'
  ],

  adoptionNote: 'Bi đang chuẩn bị được xuất viện và cần một gia đình hoặc người foster có thời gian đồng hành cùng em trong quá trình tập đi, vận động và phục hồi. Một môi trường yên tĩnh, an toàn và có người thường xuyên chăm sóc sẽ phù hợp với em.'
},
{
  id: 'pet-u',
  name: 'U',
  species: 'dog',
  breed: 'Chó',
  age: 'Chưa xác định',
  gender: 'Đực',
  weight: 'Chưa cập nhật',
  size: 'Vừa',
  location: 'Nhà Chó - Hà Nội',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: false,
  status: 'available',
  rescueDate: '09/2025',

  story: 'U là một chú chó được Trạm đón về từ Hạ Mỗ, Đan Phượng vào tháng 9/2025 trong tình trạng kiệt sức. Trên mặt em là một khối u lớn đã hoại tử, bốc mùi và gần như chặn mất đường thở. Em bị bỏ lại bên một đoạn đường vắng giữa trời nắng gắt, chỉ còn đủ sức đứng run rẩy và có lúc gần như đổ xuống vì kiệt sức. Điều phối của Trạm đã chạy xe máy hơn 60km cả đi lẫn về để đưa em tới bệnh viện. Vừa đến nơi, U ngất lịm. Kết quả xét nghiệm cho thấy em bị thiếu máu nặng, nhiễm ký sinh trùng máu và chức năng gan thận đều suy giảm. Ban đầu, Trạm chỉ hy vọng có thể giảm đau và điều trị cho em được đến đâu hay đến đó. Nhưng U đã kiên cường vượt qua. Suốt 5 tháng nằm viện, em phải trải qua rất nhiều mũi tiêm và sử dụng nhiều loại thuốc, bao gồm giảm đau, kháng sinh, kháng viêm, thuốc bổ và hóa chất điều trị ung thư. Dù vậy, em vẫn luôn vui vẻ, ngày ngày khều bát xin ăn và giữ tinh thần rất tốt. Khi khỏe hơn, U còn nghịch ngợm đến mức gặm mẻ cả cánh cửa gỗ của phòng khám. Sau hành trình dài điều trị, từ một chú chó từng đứng bên bờ vực sinh tử, U hôm nay đã khỏe mạnh hơn rất nhiều và sẵn sàng tìm một gia đình yêu thương em đến cuối đời.',

  personality: [
    'Vui vẻ',
    'Kiên cường',
    'Tham ăn',
    'Nghịch ngợm',
    'Quấn người'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Nhà Chó - Khu chăm sóc',

  images: [
    cpap7
  ],

  specialNeeds: [
    'Từng điều trị khối u và ung thư',
    'Cần theo dõi sức khỏe định kỳ',
    'Cần chế độ chăm sóc và dinh dưỡng phù hợp'
  ],

  adoptionNote: 'U đã vượt qua một hành trình điều trị dài và hiện đã sẵn sàng tìm mái ấm. Em là một chú chó vui vẻ, ham ăn và khá nghịch ngợm, cần một gia đình yêu thương và đồng hành cùng em lâu dài.'
},
{
  id: 'pet-11067',
  name: 'CPAPS_11067',
  species: 'dog',
  breed: 'Poodle',
  age: 'Chưa xác định',
  gender: 'Chưa xác định',
  weight: 'Chưa cập nhật',
  size: 'Nhỏ',
  location: 'Nhà Chung - Hà Nội',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: false,
  status: 'available',
  rescueDate: '08/2026',

  story: 'CPAPS_11067 là một bé Poodle từng bị chủ làm ngã từ tầng 2 xuống khiến chân bị gãy. Thay vì đưa em đi chữa trị, người chủ lại bế em vào một góc nhà và bỏ mặc. Sau nhiều ngày đói khát và không được điều trị, vết thương ở chân dần hoại tử. Em được hàng xóm phát hiện sau khoảng một tuần và liên hệ với Trạm để cứu hộ. Khi nhập viện, em sốt cao, vết thương đã hoại tử và có dấu hiệu nhiễm trùng máu. Vì em đã đói lả, bác sĩ phải cho em ăn tạm cháo, vệ sinh và xử lý vết thương, đắp kháng sinh lên phần chân bị tổn thương trước khi tiến hành phẫu thuật. Sau đó em sốt li bì suốt 2 ngày mới dần tỉnh lại và hồi phục. Dù phải chịu rất nhiều đau đớn, em vẫn vô cùng ngoan ngoãn, chịu khó ăn từng thìa cháo được bón. Sau một tháng được chăm sóc và điều trị, em đã có thể lò cò chạy nhảy, vui vẻ nô đùa mỗi khi các anh chị ghé thăm. Em đã vượt qua giai đoạn nguy hiểm và hiện đang tìm một gia đình yêu thương để có thể sống những ngày tháng bình yên còn lại.',

  personality: [
    'Ngoan',
    'Hiền',
    'Kiên cường',
    'Quấn người',
    'Thích nô đùa'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Nhà Chung - Khu chăm sóc',

  images: [
    cpap8
  ],

  specialNeeds: [
    'Chỉ còn 3 chân sau điều trị chấn thương',
    'Cần theo dõi vết thương và sức khỏe định kỳ',
    'Cần môi trường sống an toàn, hạn chế nguy cơ té ngã'
  ],

  adoptionNote: 'Em đã vượt qua giai đoạn nguy hiểm và hiện có thể lò cò chạy nhảy, vui vẻ chơi đùa. Trạm mong tìm được một gia đình yêu thương và kiên nhẫn để em có một mái nhà ổn định, bù đắp cho những ngày tháng đau đớn đã trải qua.'
},
{
  id: 'pet-xinh',
  name: 'Xinh',
  species: 'cat',
  breed: 'Mèo',
  age: 'Chưa xác định',
  gender: 'Chưa xác định',
  weight: 'Chưa cập nhật',
  size: 'Nhỏ',
  location: 'Nhà Chung - Hà Nội',
  vaccinated: false,
  spayed: false,
  dewormed: false,
  isUrgent: false,
  status: 'available',
  rescueDate: 'Khoảng 6 tháng trước',

  story: 'Xinh là một bé mèo từng bị đánh dẫn tới tổn thương hệ thần kinh và lên những cơn co giật liên tục. Em về với Trạm sau khi đi lạc vào nhà một người dân. Hai ngày đầu, em vẫn được cho ăn bình thường rồi lại bỏ đi. Đến ngày thứ 3, mọi người phát hiện em nằm bẹp một chỗ, người lạnh ngắt, chân tay cứng đơ nên vội đưa em đi cấp cứu theo hướng dẫn của Trạm. Những ngày đầu ở viện, Xinh gần như không thể tự ăn uống, cơ thể liên tục lên cơn co giật. Có lúc sau khi truyền dịch, em co cứng toàn thân, chân duỗi thẳng và mất ý thức trong vài phút. Các bác sĩ phải thay nhau theo dõi, bón từng chút pate loãng và dùng xilanh bơm nước vì em không còn sức tự nuốt. Em cũng được thường xuyên xoay trở và xoa bóp chân tay để tránh biến chứng do nằm lâu. Sau hơn một tuần điều trị, Xinh bắt đầu có phản ứng trở lại và tự ăn được một chút. Đến khoảng ngày thứ 14, em đã có thể tự chống hai chân trước để ngồi dậy và sau đó tập bước những bước đầu tiên. Từ đó em hồi phục chậm nhưng đều, học lại cách ăn, cách đi và cả cách làm nũng. Những cơn co giật thưa dần rồi biến mất. Sau nửa năm đồng hành cùng Trạm, cô bé từng nằm bất động nay đã có thể chạy ra xin ăn khi nghe tiếng mở pate, ngồi trước cửa chuồng hóng chuyện và đặc biệt thích được vuốt má. Ngày trước mọi người gọi em là Xinh Thần Kinh, nhưng giờ em đã khỏe mạnh hơn rất nhiều nên chỉ còn lại một cô bé Xinh đáng yêu.',

  personality: [
    'Ngoan',
    'Quấn người',
    'Thích được vuốt ve',
    'Ham ăn',
    'Hồi phục tốt'
  ],

  goodWithKids: true,
  goodWithOtherPets: true,
  shelterRoom: 'Nhà Chung - Khu chăm sóc mèo',

  images: [
    cpap9
  ],

  specialNeeds: [
    'Từng bị tổn thương thần kinh do chấn thương',
    'Từng có các cơn co giật',
    'Cần theo dõi sức khỏe định kỳ'
  ],

  adoptionNote: 'Xinh đã hồi phục rất nhiều sau thời gian dài điều trị. Em hiện đã biết chạy, tự ăn và rất thích được con người vuốt ve. Trạm mong tìm được một gia đình yêu thương để Xinh có một cuộc sống bình yên sau những ngày tháng đau đớn.'
}
];

export const INITIAL_RESCUE_REPORTS: RescueReport[] = [
  {
    id: 'resc-101',
    reporterName: 'Nguyễn Văn Hùng',
    phone: '0988***123',
    location: 'Số 45 Đường Hoàng Hoa Thám, Ba Đình, Hà Nội',
    animalType: 'Chó',
    condition: 'Chó con bị kẹt trong cống thoát nước, sức khỏe yếu',
    urgency: 'critical',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    createdAt: 'Hôm nay lúc 09:15',
    status: 'Đội cứu hộ đang di chuyển',
    statusStep: 2,
    notes: 'Tình nguyện viên Minh & Tuấn đã xuất phát cùng dụng cụ cứu hộ chuyên dụng.'
  },
  {
    id: 'resc-102',
    reporterName: 'Trần Thị Mai',
    phone: '0912***789',
    location: 'Khu đô thị Linh Đàm, Hoàng Mai, Hà Nội',
    animalType: 'Mèo',
    condition: 'Mèo mẹ và 3 mèo con mới sinh bị bỏ dưới gầm cầu thang',
    urgency: 'high',
    image: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?auto=format&fit=crop&w=800&q=80',
    createdAt: 'Hôm qua lúc 18:40',
    status: 'Đang hồi phục tại Trạm',
    statusStep: 4,
    notes: 'Đã đưa về phòng ấm, mèo mẹ đã ăn hạt và sữa ấm. Tình trạng sức khỏe ổn định.'
  },
  {
    id: 'resc-103',
    reporterName: 'Lê Hoàng Nam',
    phone: '0904***456',
    location: 'Ngã tư Nguyễn Trãi - Khuất Duy Tiến, Thanh Xuân',
    animalType: 'Chó',
    condition: 'Chó cỏ bị thương nhẹ ở chân sau sau va chạm giao thông',
    urgency: 'medium',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80',
    createdAt: '2 ngày trước',
    status: 'Đã an toàn',
    statusStep: 5,
    notes: 'Đã băng bó và tiêm phòng, đã chuyển sang khu hồi phục tìm người nhận nuôi.'
  }
];

export const INITIAL_LOST_FOUND: LostFoundPet[] = [
  {
    id: 'lf-01',
    type: 'lost',
    petName: 'Lucky',
    species: 'dog',
    breed: 'Corgi vàng trắng',
    color: 'Vàng cam và trắng, cụt đuôi',
    collarDescription: 'Đeo vòng cổ màu đỏ có gắn chuông bạc nhỏ',
    lastSeenLocation: 'Khu vực Công viên Cầu Giấy, Hà Nội',
    lastSeenDate: '20/08/2024',
    contactName: 'Chị Lan',
    contactPhone: '0975 889 999',
    reward: '5.000.000 VNĐ',
    image: 'https://images.unsplash.com/photo-1612536057832-2ff7ead7f363?auto=format&fit=crop&w=800&q=80',
    description: 'Lucky bị giật mình bởi tiếng pháo hoa và chạy mất hướng cổng phụ công viên. Bé rất nhát người lạ, nếu nhìn thấy xin đừng đuổi theo mà hãy liên hệ ngay.',
    isResolved: false
  },
  {
    id: 'lf-02',
    type: 'found',
    species: 'cat',
    breed: 'Mèo Anh Lông Dài Xám Xanh',
    color: 'Xám khói toàn thân, mắt vàng hổ phách',
    collarDescription: 'Vòng cổ da nâu không có bảng tên',
    lastSeenLocation: 'Sảnh tòa nhà Landmark 81, Bình Thạnh, TP.HCM',
    lastSeenDate: '19/08/2024',
    contactName: 'Bảo vệ tòa nhà - Anh Tuấn',
    contactPhone: '0938 123 456',
    image: 'https://images.unsplash.com/photo-1513360309081-38f0762b8092?auto=format&fit=crop&w=800&q=80',
    description: 'Tìm thấy bé đi lạc vào sảnh lễ tân lúc 21h. Bé được chải chuốt rất sạch sẽ, có vẻ vừa mới thất lạc gần đây. Hiện đang được giữ tạm tại phòng quản lý.',
    isResolved: false
  },
  {
    id: 'lf-03',
    type: 'lost',
    petName: 'Kem',
    species: 'cat',
    breed: 'Mèo ta trắng tinh',
    color: 'Trắng tinh khiết, hai mắt hai màu (1 xanh dương, 1 xanh lá)',
    collarDescription: 'Không đeo vòng',
    lastSeenLocation: 'Khu vực Hồ Tây (Đường Trích Sài), Tây Hồ, Hà Nội',
    lastSeenDate: '18/08/2024',
    contactName: 'Anh Đức',
    contactPhone: '0912 345 678',
    reward: '3.000.000 VNĐ',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    description: 'Bé Kem mở cửa sổ nhảy ra ngoài lúc gia đình đi vắng. Rất mong mọi người xung quanh để ý giúp đỡ.',
    isResolved: false
  }
];

export const HAPPY_STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'Hành trình từ chú cún co ro dưới mưa đến thành viên cưng nhất nhà',
    petName: 'Gấu (Rescue ID: #412)',
    species: 'dog',
    adopterName: 'Gia đình chị Minh Thư',
    adoptDate: '15/10/2023',
    beforeImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    summary: 'Gấu từng bị bỏ rơi trong chiếc hộp ướt sũng. Giờ đây bé là "bảo mẫu" đáng yêu của hai đứa trẻ nhà chị Thư.',
    fullStory: 'Ngày đầu tiên đưa Gấu về, bé chỉ dám trốn dưới gầm sofa vì sợ hãi. Nhờ tình yêu kiên trì của cả gia đình, sau 3 tuần bé bắt đầu chạy ra vẫy đuôi mỗi khi các con đi học về. Nhận nuôi là quyết định tuyệt vời nhất của gia đình tôi!',
    quote: '"Chúng tôi không chỉ cứu một mạng sống, mà chính Gấu đã mang lại vô vàn nụ cười và sự ấm áp cho ngôi nhà."'
  },
  {
    id: 'story-2',
    title: 'Phép màu của Bông: Nàng mèo tai cụp tìm lại ánh sáng',
    petName: 'Bông (Rescue ID: #528)',
    species: 'cat',
    adopterName: 'Anh Tuấn Anh & Bạn gái',
    adoptDate: '01/12/2023',
    beforeImage: 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    summary: 'Bị viêm da nặng khi được Trạm tiếp nhận, sau 4 tháng điều trị và tình yêu của gia đình mới, Bông đã lột xác hoàn toàn.',
    fullStory: 'Nhìn những tấm ảnh trước đây và hiện tại của Bông, không ai nghĩ đây là cùng một bé mèo. Lớp lông mềm mượt trở lại, ánh mắt tràn ngập tin tưởng.',
    quote: '"Mỗi vết sẹo đều là huy chương của sự kiên cường. Đừng ngần ngại trao cơ hội cho các bé từng bị tổn thương."'
  }
];

export const VOLUNTEER_ROLES: VolunteerRole[] = [
  {
    id: 'vol-1',
    title: 'Chăm sóc & Vui chơi cùng thú cưng tại Trạm',
    commitment: 'Cuối tuần hoặc 2 buổi/tuần (3-4 giờ/buổi)',
    location: 'Trạm Cứu Hộ Tây Hồ, Hà Nội',
    description: 'Hỗ trợ dọn dẹp vệ sinh chuồng trại, cho ăn, chải lông và dắt các bé đi dạo giải tỏa căng thẳng.',
    tasks: [
      'Cho cún/mèo ăn theo khẩu phần dinh dưỡng',
      'Dắt chó đi dạo trong khuôn viên sân cỏ an toàn',
      'Chải lông, lau tai và kiểm tra tình trạng sức khỏe nhẹ nhàng',
      'Tập luyện các lệnh cơ bản giúp bé tăng cơ hội được nhận nuôi'
    ],
    requirements: [
      'Yêu thương động vật, không ngại mùi và việc chân tay',
      'Độ tuổi từ 18 trở lên',
      'Có tính kiên nhẫn và trách nhiệm với lịch trực đã đăng ký'
    ],
    spotsAvailable: 6
  },
  {
    id: 'vol-2',
    title: 'Gia đình Tạm Trú (Foster Care)',
    commitment: '2 tuần đến 2 tháng tùy trường hợp',
    location: 'Tại nhà riêng của tình nguyện viên',
    description: 'Chăm sóc tạm thời cho các bé cún/mèo con sơ sinh hoặc các bé đang hồi phục sau phẫu thuật cần không gian yên tĩnh.',
    tasks: [
      'Cung cấp chỗ ở sạch sẽ, an toàn trong nhà',
      'Cho uống thuốc/chăm sóc phục hồi theo chỉ định bác sĩ trạm',
      'Gửi video/ảnh cập nhật tiến độ cho Trạm hàng tuần',
      'Toàn bộ chi phí thức ăn, thuốc men và viện phí do Trạm tài trợ 100%'
    ],
    requirements: [
      'Nhà ở kín đáo, an toàn, được sự đồng thuận của gia đình/chủ nhà',
      'Có kinh nghiệm nuôi thú cưng cơ bản'
    ],
    spotsAvailable: 4
  },
  {
    id: 'vol-3',
    title: 'Nhiếp ảnh gia & Sáng tạo nội dung',
    commitment: 'Linh hoạt (1-2 buổi chụp/tháng)',
    location: 'Trạm hoặc sự kiện nhận nuôi',
    description: 'Chụp những bức ảnh chân dung và quay video đáng yêu để giúp các bé nhanh chóng tìm được mái ấm.',
    tasks: [
      'Chụp ảnh chân dung các bé mới tiếp nhận',
      'Quay video ngắn ghi lại khoảnh khắc vui đùa',
      'Biên tập nội dung lan tỏa trên mạng xã hội'
    ],
    requirements: [
      'Có máy ảnh hoặc điện thoại chụp ảnh chất lượng cao',
      'Khiếu thẩm mỹ và tình cảm đối với động vật'
    ],
    spotsAvailable: 3
  }
];

export const DONATION_PACKAGES: DonationPackage[] = [
  {
    id: 'pack-50k',
    title: 'Bữa Ăn No',
    amount: 50000,
    description: 'Cung cấp 3 ngày hạt dinh dưỡng và pate thơm ngon cho 1 bé cún/mèo tại trạm.',
    impact: '3 ngày ăn no đủ',
    iconName: 'Bowl',
  },
  {
    id: 'pack-100k',
    title: 'Gói Y Tế Cơ Bản',
    amount: 100000,
    description: 'Thuốc tẩy giun, nhỏ gáy trị ve rận và vitamin tăng đề kháng cho 1 bé mới cứu hộ.',
    impact: '1 liều tẩy giun & ve rận',
    iconName: 'ShieldPlus',
  },
  {
    id: 'pack-200k',
    title: 'Tiêm Phòng Toàn Diện',
    amount: 200000,
    description: 'Tài trợ 1 mũi vaccine 7 bệnh (chó) hoặc 4 bệnh (mèo) + sổ theo dõi sức khỏe.',
    impact: '1 mũi vaccine ngừa bệnh',
    iconName: 'HeartPulse',
    popular: true
  },
  {
    id: 'pack-500k',
    title: 'Gói Triệt Sản & Phục Hồi',
    amount: 500000,
    description: 'Chi phí phẫu thuật triệt sản an toàn cùng thuốc giảm đau, kháng sinh hậu phẫu.',
    impact: '1 ca phẫu thuật triệt sản',
    iconName: 'Stethoscope'
  },
  {
    id: 'pack-1m',
    title: 'Bảo Trợ Một Mái Ấm',
    amount: 1000000,
    description: 'Bảo trợ toàn diện nơi ở, thức ăn và chăm sóc y tế cho 1 bé trong suốt 1 tháng.',
    impact: '1 tháng chăm sóc trọn gói',
    iconName: 'Crown'
  }
];
