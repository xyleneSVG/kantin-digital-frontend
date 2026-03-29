import { Container, HeaderWithBackButtonComponent } from "@/src/components/ui";
import { NotificationItemComponent } from "./NotificationItem";

export default function NotificationsPage() {
  return (
    <div className="bg-background-dark h-screen">
      <HeaderWithBackButtonComponent
        className={"pt-5 pb-6.25"}
        title={"Notifikasi"}
      />

      <Container
        needPadding={false}
        type="round"
        className="bg-grey min-h-[calc(100vh-69px)] pt-5 pb-20"
      >
        <div className="mb-4">
          <p className="mb-4 pl-4 text-[12px] font-light">Minggu ini</p>

          <NotificationItemComponent
            icon="ready"
            title="Pesanan Siap Diambil!"
            message="Ayam Geprek Kantin A sudah matang. Yuk ambil sekarang!"
            time="5 menit yang lalu"
          />

          <NotificationItemComponent
            icon="cook"
            title="Pesanan Sedang Diproses"
            message="Pesanan kamu sedang dimasak oleh Kantin B."
            time="10 menit yang lalu"
          />

          <NotificationItemComponent
            icon="ready"
            title="Minuman Siap!"
            message="Es Teh Manis sudah siap diambil."
            time="30 menit yang lalu"
          />
        </div>

        <div className="mb-4">
          <p className="mb-4 pl-4 text-[12px] font-light">Bulan ini</p>

          <NotificationItemComponent
            icon="ready"
            title="Pesanan Selesai"
            message="Nasi Goreng Kantin C sudah kamu ambil."
            time="2 hari yang lalu"
          />

          <NotificationItemComponent
            icon="cook"
            title="Pesanan Diproses"
            message="Mie Ayam sedang dimasak."
            time="3 hari yang lalu"
          />

          <NotificationItemComponent
            icon="ready"
            title="Pesanan Siap Diambil!"
            message="Bakso sudah siap di kantin."
            time="1 minggu yang lalu"
          />
        </div>

        <div className="mb-4">
          <p className="mb-4 pl-4 text-[12px] font-light">Tahun lalu</p>

          <NotificationItemComponent
            icon="ready"
            title="Pesanan Selesai"
            message="Nasi Goreng Kantin C sudah kamu ambil."
            time="2 hari yang lalu"
          />

          <NotificationItemComponent
            icon="cook"
            title="Pesanan Diproses"
            message="Mie Ayam sedang dimasak."
            time="3 hari yang lalu"
          />

          <NotificationItemComponent
            icon="ready"
            title="Pesanan Siap Diambil!"
            message="Bakso sudah siap di kantin."
            time="1 minggu yang lalu"
          />
        </div>
      </Container>
    </div>
  );
}
