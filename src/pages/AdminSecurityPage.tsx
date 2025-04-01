
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

const AdminSecurityPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Segurança</h1>
        <p className="text-muted-foreground">
          Gerencie sua segurança e credenciais de acesso
        </p>
      </div>
      
      <div className="flex justify-center pt-4">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default AdminSecurityPage;
